import { Box, Button, makeStyles, useTheme } from "@material-ui/core";
import useComponentSize from "@rehooks/component-size";
import cx from "classnames";
import React from "react";
import { scrollIntoView } from "../lib/scrollIntoView";
import { useDebouncedCallback } from "use-debounce";
import { Padding, PlayingCard } from ".";
import { Card } from "../types/DomainModels";
const numberToOrdinal = (naturalNumber: number) => {
  switch (naturalNumber) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${naturalNumber}th`;
  }
};

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
}));
/**
 * A component responsible for rendering a hand of cards, and prompting the user to pick 1 or more of them.
 */
export const CardChooser = React.memo(function CardChooser(props: {
  /**
   * The cards available to the user - NOT the state of the users hand, i.e. if the user picks cards, this component will prevent
   * the user from selecting them again, it's not expected of you (the parent component) to manage this.
   */
  cards: Card[];
  /**
   * The number of required cards to be picked
   */
  pickCount: number;
  onPicked: (card: Card) => void;
  /**
   * The next card position the user is required to choose.
   */
  nextPickIndex: number;
  /**
   * The ordered set of cards that have been picked.
   */
  picked: (Card | undefined)[];
}) {
  const theme = useTheme();
  const currentHand = React.useMemo(
    () =>
      props.cards.filter(
        (card) => !props.picked.find((pick) => pick?.text === card.text)
      ),
    [props.cards, props.picked]
  );
  const classes = useStyles();
  const [cardIndex, setCardIndex] = React.useState(
    Math.floor(currentHand.length / 2)
  );
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
      if (!(index >= 0 && index < currentHand.length)) return;

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
              validTarget: function(_, parentsScrolled) {
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
    [cardIndexToScrollLeft, currentHand.length]
  );

  const invisibleCardAtEdgesWidth =
    (size.width || 1) / 2 - cardWidthWithPadding / 2;
  const [snapScroll] = useDebouncedCallback(setSnappedIndex, 100);
  const onScroll = React.useCallback(
    (e: React.UIEvent) => {
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

      snapScroll(newCardIndex);
      /*    if (indexFloat % 1 === 0.5) {
      setCardIndex(newCardIndex);
    } */
    },
    [cardIndex, cardWidthWithPadding, snapScroll, snappedIndex]
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
            validTarget: function(_, parentsScrolled) {
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

          {currentHand.map((card, i) => {
            const selected = i === cardIndex;
            return (
              <div
                key={i}
                className={cx(classes.card, selected && classes.middleCard)}
              >
                <PlayingCard
                  width={width}
                  elevation={selected ? 5 : undefined}
                  variant="white"
                  text={card.text}
                  footer={
                    selected ? (
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => props.onPicked(card)}
                        >
                          {props.pickCount <= 1
                            ? "Pick"
                            : numberToOrdinal(props.nextPickIndex + 1)}
                        </Button>
                      </Box>
                    ) : null
                  }
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
        {currentHand.map((card, index) => (
          <div key={index}>
            <svg
              className={classes.cardIndexIndicatorCircle}
              width="1.25rem"
              height="1.25rem"
              viewBox="0 0 100 100"
              onClick={() => scrollToIndex(index)}
            >
              <circle
                cx="50%"
                cy="50%"
                r={50}
                fill={cardIndex === index ? "white" : "#777"}
              />
            </svg>
          </div>
        ))}
      </Box>
    </Box>
  );
});
