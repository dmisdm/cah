import { Box, makeStyles, useTheme } from "@material-ui/core";
import useComponentSize from "@rehooks/component-size";
import cx from "classnames";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Padding } from ".";
import { scrollIntoView } from "../lib/scrollIntoView";

const cardHorizontalPadding = "2rem";
const useStyles = makeStyles((theme) => ({
  scrollContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    overflow: "auto",
  },
  cardsContainer: {
    margin: "auto",
    display: "flex",
  },
  slide: {
    overflow: "visible !important",
    userSelect: "none",
  },
  card: {
    padding: `0 ${cardHorizontalPadding}`,
    transition: "transform 300ms cubic-bezier(.25,.68,.17,.93)",
  },
  middleCard: {
    transform: "scale(1.3, 1.3)",
  },
  cardIndexIndicatorCircle: {
    cursor: "pointer",

    "&:hover": {
      filter: "brightness(1.3)",
    },
  },
  circleSvg: {
    mixBlendMode: "difference",
  },
}));
/**
 * A component responsible for rendering a hand of cards, and prompting the user to pick 1 or more of them.
 */
export function CardChooser<CardType, CardData>(props: {
  cards: CardType[];
  initialIndex: number;
  Card: React.ComponentType<{
    card: CardType;
    width: string;
    selected: boolean;
    cardData: CardData;
  }>;
  cardData: CardData;
  /**
   * Use this prop to stop the user from interacting, and just watch another user selecting a card.
   * This prop controlls the current index of the card chooser component, and should change as the other user scrolls.
   */
  spectatingIndex?: number;
}) {
  const { cards, initialIndex, cardData } = props;

  const theme = useTheme();

  const classes = useStyles();

  const [cardIndex, setCardIndex] = React.useState(Math.floor(initialIndex));
  const [snappedIndex, setSnappedIndex] = React.useState(cardIndex);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollingToIndex = React.useRef(false);
  const size = useComponentSize(containerRef);

  const cardWidthWithPadding = Math.min(
    Math.max(size.width * 0.5, 250),
    size.height / theme.cardAspectRatio
  );

  const cardIndexToScrollLeft = React.useCallback(
    (index: number) => cardWidthWithPadding * index,
    [cardWidthWithPadding]
  );
  const scrollToIndex = React.useCallback(
    (index: number) => {
      if (!(index >= 0 && index < cards.length)) return;

      scrollingToIndex.current = true;
      if (containerRef.current) {
        if (index >= 0) {
          scrollIntoView(
            {
              left: cardIndexToScrollLeft(index),
              top: 0,
              parent: containerRef.current,
            },
            {
              time: 200,
              validTarget: function (_, parentsScrolled) {
                return parentsScrolled < 3;
              },
            },
            () => {
              scrollingToIndex.current = false;
              setCardIndex(index);
            }
          );
        }
      }
    },
    [cardIndexToScrollLeft, cards.length]
  );

  const invisibleCardAtEdgesWidth =
    (size.width || 1) / 2 - cardWidthWithPadding / 2;
  const snapScroll = useDebouncedCallback(setSnappedIndex, 100);
  const onScroll = React.useCallback(
    (e: React.UIEvent) => {
      if (props.spectatingIndex !== undefined) {
        e.preventDefault();
      }
      if (scrollingToIndex.current) return;
      const indexFloat =
        (e.currentTarget.scrollLeft + cardWidthWithPadding / 2) /
        cardWidthWithPadding;
      const newCardIndex = Math.floor(indexFloat);
      if (cardIndex !== newCardIndex) {
        setCardIndex(newCardIndex);
      }
      if (snappedIndex !== -1) {
        setSnappedIndex(-1);
      }

      snapScroll.callback(newCardIndex);
      /*    if (indexFloat % 1 === 0.5) {
      setCardIndex(newCardIndex);
    } */
    },
    [
      cardIndex,
      cardWidthWithPadding,
      props.spectatingIndex,
      snapScroll,
      snappedIndex,
    ]
  );

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = cardIndex * cardWidthWithPadding;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);
  React.useEffect(() => {
    if (containerRef.current) {
      if (snappedIndex >= 0) {
        scrollIntoView(
          {
            left: cardIndexToScrollLeft(snappedIndex),
            top: 0,
            parent: containerRef.current,
          },
          {
            time: 200,
            validTarget: function (_, parentsScrolled) {
              return parentsScrolled < 3;
            },
          }
        );
      }
    }
  }, [cardIndexToScrollLeft, snappedIndex]);

  const width = `calc(${cardWidthWithPadding}px - ${cardHorizontalPadding} * 2)`;

  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
      <div
        className={classes.scrollContainer}
        onScroll={onScroll}
        ref={containerRef}
      >
        <div className={classes.cardsContainer}>
          {/* Invisible block that centers the left most card */}
          <Box width={invisibleCardAtEdgesWidth} />

          {cards.map((card, i) => {
            const selected = i === cardIndex;
            return (
              <div
                key={i}
                className={cx(classes.card, selected && classes.middleCard)}
              >
                <props.Card
                  card={card}
                  width={width}
                  selected={selected}
                  cardData={cardData}
                />
              </div>
            );
          })}
          {/* Invisible block that centers the right most card */}
          <Box width={invisibleCardAtEdgesWidth} />
        </div>
      </div>
      <Padding size={2} />
      <Box display="flex" justifyContent="space-around" paddingX="1rem">
        {cards.map((card, index) => (
          <div key={index}>
            <svg
              className={classes.cardIndexIndicatorCircle}
              width="1.25rem"
              height="1.25rem"
              viewBox="0 0 100 100"
              onClick={() => scrollToIndex(index)}
            >
              <circle
                className={classes.circleSvg}
                cx="50%"
                cy="50%"
                r={50}
                /* Will use mixBlendMode: difference, meaning it will work on black or white backgrounds */
                fill={cardIndex === index ? "white" : "#7b7b7b"}
              />
            </svg>
          </div>
        ))}
      </Box>
    </Box>
  );
}
