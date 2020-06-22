import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { sanitize } from "dompurify";
import React from "react";
import { MdClose } from "react-icons/md";
import { BlackCard, Card, PlayerInfo } from "../types/DomainModels";
import { CardChooser } from "./CardChooser";
import { CardLayout } from "./CardLayout";

const answerSpacePattern = /_+/;
const answerSpaceWithPeriodPattern = /_+\./;

const useFilledInAnswerStyles = makeStyles((theme) => ({
  root: {
    fontSize: "inherit",
  },
}));

const FilledInAnswer = (props: {
  onRemove: () => void;
  text: string;
  inline: boolean;
}) => {
  const classes = useFilledInAnswerStyles();
  return (
    <Box
      display={props.inline ? "inline" : "block"}
      component="strong"
      className={classes.root}
    >
      <IconButton color="secondary" onClick={props.onRemove}>
        <MdClose />
      </IconButton>
      {props.text}
    </Box>
  );
};
/**
 * Responsible for rendering card text and placing picked cards into the answer gaps.
 * Picked cards will also be removable.
 */
const CardText = React.memo(
  (props: {
    text: string;
    pickedCards: (Card | undefined)[];
    onRemove: (cardIndex: number) => void;
  }) => {
    const parts = React.useMemo(() => {
      let currentAnswerIndex = 0;
      let text = sanitize(props.text);
      const parts = [] as React.ReactNode[];

      while (true) {
        const match1 = text.match(answerSpaceWithPeriodPattern);
        const match2 = text.match(answerSpacePattern);

        if (!match1 && !match2) {
          parts.push(<span key={parts.length}>{text}</span>);
          break;
        }

        const match1Index = match1?.index || -1;
        const match2Index = match2?.index || -1;
        const pickedCard = props.pickedCards[currentAnswerIndex];
        if (match1Index <= match2Index) {
          parts.push(
            <span
              key={parts.length}
              dangerouslySetInnerHTML={{ __html: text.slice(0, match1Index) }}
            />
          );

          if (pickedCard) {
            const answerIndex = currentAnswerIndex;
            parts.push(
              <FilledInAnswer
                inline={false}
                key={parts.length}
                text={pickedCard.text}
                onRemove={() => props.onRemove(answerIndex)}
              />
            );
          } else {
            parts.push(
              <div
                style={{
                  display: "inline-block",
                  width: "100%",
                  borderBottom: "solid 1.5px white",
                }}
                key={parts.length}
              />
            );
          }

          currentAnswerIndex++;
          text = text.slice(match1Index + match1![0].length);
        } else if (match2Index < match1Index) {
          parts.push(
            <span
              key={parts.length}
              dangerouslySetInnerHTML={{ __html: text.slice(0, match2Index) }}
            />
          );
          if (pickedCard) {
            const answerIndex = currentAnswerIndex;
            parts.push(
              <FilledInAnswer
                inline
                key={parts.length}
                text={pickedCard.text}
                onRemove={() => props.onRemove(answerIndex)}
              />
            );
          } else {
            parts.push(
              <span
                style={{
                  display: "inline-block",
                  width: "7em",
                  borderBottom: "solid 1.5px white",
                }}
                key={parts.length}
              />
            );
          }
          currentAnswerIndex++;
          text = text.slice(match2Index + match2![0].length);
        }
      }

      return parts;
    }, [props]);
    return <span>{parts}</span>;
  }
);

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
  return (
    <div className={styles.container}>
      <CardLayout
        noPadding
        variant="black"
        heading={
          <Box padding="1.5rem" width="fit-content">
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
          </Box>
        }
        body={
          onlyValidPicked.length < props.blackCard.pick ? (
            <CardChooser
              nextPickIndex={nextPickIndex}
              picked={picked}
              onPicked={(card) =>
                setPicked((picked) => {
                  picked[nextPickIndex] = card;
                  return [...picked];
                })
              }
              pickCount={props.blackCard.pick}
              cards={props.currentPlayer.hand}
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
