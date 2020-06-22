enum EventType {
  COMPLETE = "complete",
  CANCELED = "cancled",
}
type Extra = {
  self?: Element | null;
  _scrollSettings?: InnerScrollSettings | null;
};

type CustomElement = Element &
  Extra & {
    parentElement?: (Element["parentElement"] & Extra) | null;
  };

type PositionTarget = { left: number; top: number; parent: Element };
type ScrollSettings = {
  align?: {
    top?: number;
    left?: number;
    leftOffset?: number;
    topOffset?: number;
  };

  isWindow?(el: unknown): el is Window;
  time?: number;
  ease?: (x: number) => number;
  debug?: boolean;
  cancellable?: boolean;
  validTarget?: (el: Element | Window, parents: number) => boolean;
  isScrollable?: (
    el: Element | Window,
    defaultIsScrollable: (el: Element | Window) => boolean
  ) => boolean;
};

type InnerScrollSettings = ScrollSettings & {
  maxSynchronousAlignments: number;
  endIterations: number;
  end: (eventType: EventType) => void;
  startTime: number;
  target: CustomElement | PositionTarget;
  time: NonNullable<ScrollSettings["time"]>;
  ease: NonNullable<ScrollSettings["ease"]>;
  isWindow: NonNullable<ScrollSettings["isWindow"]>;
};
function raf(task: () => void) {
  if ("requestAnimationFrame" in window) {
    return window.requestAnimationFrame(task);
  }

  setTimeout(task, 16);
}

function setElementScroll(element: CustomElement, x: number, y: number) {
  if (element.self === element) {
    element.scrollTo(x, y);
  } else {
    element.scrollLeft = x;
    element.scrollTop = y;
  }
}

function getTargetScrollLocation(
  scrollSettings: InnerScrollSettings,
  parent: CustomElement
) {
  let align = scrollSettings.align,
    target = scrollSettings.target,
    targetPosition =
      "left" in target
        ? { ...target, width: 0, height: 0 }
        : target.getBoundingClientRect(),
    parentPosition,
    x,
    y,
    differenceX,
    differenceY,
    targetWidth,
    targetHeight,
    leftAlign = align && align.left != null ? align.left : 0.5,
    topAlign = align && align.top != null ? align.top : 0.5,
    leftOffset = align && align.leftOffset != null ? align.leftOffset : 0,
    topOffset = align && align.topOffset != null ? align.topOffset : 0,
    leftScalar = leftAlign,
    topScalar = topAlign;

  if (scrollSettings.isWindow(parent)) {
    targetWidth = Math.min(targetPosition.width, parent.innerWidth);
    targetHeight = Math.min(targetPosition.height, parent.innerHeight);
    x =
      "left" in target
        ? target.left
        : targetPosition.left +
          parent.pageXOffset -
          parent.innerWidth * leftScalar +
          targetWidth * leftScalar -
          leftOffset;
    y =
      "top" in target
        ? target.top
        : targetPosition.top +
          parent.pageYOffset -
          parent.innerHeight * topScalar +
          targetHeight * topScalar -
          topOffset;

    differenceX = x - parent.pageXOffset;
    differenceY = y - parent.pageYOffset;
  } else {
    targetWidth = targetPosition.width;
    targetHeight = targetPosition.height;
    parentPosition = parent.getBoundingClientRect();
    let offsetLeft =
      targetPosition.left - (parentPosition.left - parent.scrollLeft);
    let offsetTop =
      targetPosition.top - (parentPosition.top - parent.scrollTop);
    x = offsetLeft + targetWidth * leftScalar - parent.clientWidth * leftScalar;
    y = offsetTop + targetHeight * topScalar - parent.clientHeight * topScalar;
    x -= leftOffset;
    y -= topOffset;
    x =
      "left" in target
        ? target.left
        : Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
    y =
      "top" in target
        ? target.top
        : Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
    differenceX = x - parent.scrollLeft;
    differenceY = y - parent.scrollTop;
  }

  return {
    x: x,
    y: y,
    differenceX: differenceX,
    differenceY: differenceY,
  };
}

function animate(parent: CustomElement): void {
  let scrollSettings = parent._scrollSettings;

  if (!scrollSettings) {
    return;
  }

  let maxSynchronousAlignments = scrollSettings.maxSynchronousAlignments;

  let location = getTargetScrollLocation(scrollSettings, parent),
    time = Date.now() - scrollSettings.startTime,
    timeValue = Math.min((1 / scrollSettings.time) * time, 1);

  if (scrollSettings.endIterations >= maxSynchronousAlignments) {
    setElementScroll(parent, location.x, location.y);
    parent._scrollSettings = null;
    return scrollSettings.end(EventType.COMPLETE);
  }

  let easeValue = 1 - scrollSettings.ease(timeValue);

  setElementScroll(
    parent,
    location.x - location.differenceX * easeValue,
    location.y - location.differenceY * easeValue
  );

  if (time >= scrollSettings.time) {
    scrollSettings.endIterations++;
    return animate(parent);
  }

  raf(animate.bind(null, parent));
}

function defaultIsWindow(target: { self?: Window }): target is Window {
  return target.self === target;
}

function transitionScrollTo(
  target: CustomElement | PositionTarget,
  parent: CustomElement,
  settings: ScrollSettings | InnerScrollSettings,
  callback: (type: EventType) => void
) {
  let idle = !parent._scrollSettings,
    lastSettings = parent._scrollSettings,
    now = Date.now(),
    cancelHandler: () => void;

  if (lastSettings) {
    lastSettings.end(EventType.CANCELED);
  }

  function end(endType: EventType) {
    parent._scrollSettings = null;

    if (parent.parentElement && parent.parentElement._scrollSettings) {
      parent.parentElement._scrollSettings.end(endType);
    }

    if (settings.debug) {
      console.log("Scrolling ended with type", endType, "for", parent);
    }

    callback(endType);
    if (cancelHandler) {
      parent.removeEventListener("touchstart", cancelHandler);
      parent.removeEventListener("wheel", cancelHandler);
    }
  }

  let maxSynchronousAlignments =
    "maxSynchronousAlignments" in settings
      ? settings.maxSynchronousAlignments
      : null;

  if (maxSynchronousAlignments == null) {
    maxSynchronousAlignments = 3;
  }

  parent._scrollSettings = {
    startTime: now,
    endIterations: 0,
    target: target,
    time: settings.time || 1000,
    ease:
      settings.ease ||
      function(v: number) {
        return 1 - Math.pow(1 - v, v / 2);
      },
    align: settings.align,
    isWindow: settings.isWindow || defaultIsWindow,
    maxSynchronousAlignments: maxSynchronousAlignments,
    end: end,
  };

  if (settings.cancellable) {
    cancelHandler = end.bind(null, EventType.CANCELED);
    parent.addEventListener("touchstart", cancelHandler, { passive: true });
    parent.addEventListener("wheel", cancelHandler, { passive: true });
  }

  if (idle) {
    animate(parent);
  }
}

function defaultIsScrollable(element: Element | Window) {
  return (
    "pageXOffset" in element ||
    ((element.scrollHeight !== element.clientHeight ||
      element.scrollWidth !== element.clientWidth) &&
      getComputedStyle(element).overflow !== "hidden")
  );
}

function defaultValidTarget() {
  return true;
}

function findParentElement(el: Element): Element | Window | undefined | null {
  if (el.assignedSlot) {
    return findParentElement(el.assignedSlot);
  }

  if (el.parentElement) {
    if (el.parentElement.tagName === "BODY") {
      return el.parentElement?.ownerDocument?.defaultView;
    }
    return el.parentElement;
  }

  if (el.getRootNode) {
    let parent = el.getRootNode();
    if (parent instanceof ShadowRoot) {
      return parent.host;
    }
  }
}

export function scrollIntoView(
  target: Element | PositionTarget,
  settings: Pick<
    ScrollSettings,
    | "align"
    | "cancellable"
    | "debug"
    | "ease"
    | "isWindow"
    | "time"
    | "validTarget"
    | "isScrollable"
  >,
  callback?: (eventType: EventType) => void
) {
  if (!target) {
    return;
  }

  const settingsWithDefault = {
    validTarget: defaultValidTarget,
    cancellable: true,
    ...settings,
  };

  let parent = "parent" in target ? target.parent : findParentElement(target),
    parents = 1;

  function done(endType: EventType) {
    parents--;
    if (!parents) {
      callback && callback(endType);
    }
  }

  if (settings.debug) {
    console.log("About to scroll to", target);

    if (!parent) {
      console.error("Target did not have a parent, is it mounted in the DOM?");
    }
  }

  while (parent) {
    if (settings.debug) {
      console.log("Scrolling parent node", parent);
    }

    if (
      settingsWithDefault.validTarget(parent, parents) &&
      (settingsWithDefault.isScrollable
        ? settingsWithDefault.isScrollable(parent, defaultIsScrollable)
        : defaultIsScrollable(parent))
    ) {
      parents++;
      transitionScrollTo(target, parent as any, settingsWithDefault, done);
    }

    parent = "left" in target ? null : findParentElement(parent as any);

    if (!parent) {
      done(EventType.COMPLETE);
      break;
    }
  }
}
