import { Box, Button, Hidden, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { PlayingCard } from ".";
import { BlackCard, Card, PlayerInfo } from "../types/DomainModels";
import { CardChooser } from "./CardChooser";
import { CardLayout } from "./CardLayout";
import { CardText } from "./CardText";

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

function CardImpl(props: {
  width: string;
  selected: boolean;
  card: Card;
  cardData: {
    pickCount: number;
    nextPickIndex: number;
    onPicked: (card: Card) => void;
  };
}) {
  return (
    <PlayingCard
      width={props.width}
      elevation={props.selected ? 5 : undefined}
      variant="white"
      text={props.card.text}
      footer={
        props.selected ? (
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => props.cardData.onPicked(props.card)}
            >
              {props.cardData.pickCount <= 1
                ? "Pick"
                : numberToOrdinal(props.cardData.nextPickIndex + 1)}
            </Button>
          </Box>
        ) : null
      }
    />
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem",
  },
  innerContainer: {
    maxWidth: theme.breakpoints.width("sm"),
  },
}));

const getNextPickIndex = (
  requiredPickCount: number,
  picked: (Card | undefined)[]
) => {
  for (let i = 0; i < requiredPickCount; i++) {
    if (!picked[i]) {
      return i;
    }
  }
  return -1;
};

export function ChooseWhiteCard(
  props: PlayerInfo & {
    blackCard: BlackCard;
    onConfirm: (picked: Card[]) => void;
  }
) {
  const styles = useStyles();
  const [picked, setPicked] = React.useState<(Card | undefined)[]>([]);
  const onlyValidPicked = React.useMemo(
    () => picked.filter((p): p is Card => !!p),
    [picked]
  );
  const nextPickIndex = React.useMemo(
    () => getNextPickIndex(props.blackCard.pick, picked),
    [picked, props.blackCard.pick]
  );
  const currentHand = React.useMemo(
    () =>
      props.currentPlayer.hand.filter(
        (card) => !picked.find((pick) => pick?.text === card.text)
      ),
    [props.currentPlayer.hand, picked]
  );

  return (
    <div className={styles.container}>
      <CardLayout
        noPadding
        variant="black"
        heading={
          <Box padding="1.5rem" width="fit-content">
            <Hidden smUp>
              <Typography variant="h5">
                <CardText
                  onRemove={(cardIndex) =>
                    setPicked((picked) => {
                      picked[cardIndex] = undefined;
                      return [...picked];
                    })
                  }
                  pickedCards={picked}
                  text={props.blackCard.text}
                />
              </Typography>
            </Hidden>

            <Hidden xsDown>
              <Typography variant="h3">
                <CardText
                  onRemove={(cardIndex) =>
                    setPicked((picked) => {
                      picked[cardIndex] = undefined;
                      return [...picked];
                    })
                  }
                  pickedCards={picked}
                  text={props.blackCard.text}
                />
              </Typography>
            </Hidden>
          </Box>
        }
        body={
          onlyValidPicked.length < props.blackCard.pick ? (
            <CardChooser
              initialIndex={currentHand.length / 2}
              Card={CardImpl}
              cardData={{
                nextPickIndex,
                pickCount: props.blackCard.pick,
                onPicked: (card: Card) =>
                  setPicked((picked) => {
                    picked[nextPickIndex] = card;
                    return [...picked];
                  }),
              }}
              cards={currentHand}
            />
          ) : (
            <Box padding="1rem" display="flex" justifyContent="flex-end">
              <Button
                onClick={() => props.onConfirm(onlyValidPicked)}
                variant="outlined"
                color="primary"
              >
                Confirm?
              </Button>
            </Box>
          )
        }
        footer={null}
      />
    </div>
  );
}
