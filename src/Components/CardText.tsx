import React from "react";
import { Card } from "../types/DomainModels";
import { Box, IconButton, makeStyles } from "@material-ui/core";
import { MdClose } from "react-icons/md";
import { sanitize } from "dompurify";
const answerSpacePattern = /_+/;
const answerSpaceWithPeriodPattern = /_+\./;

const useFilledInAnswerStyles = makeStyles((theme) => ({
  root: {
    fontSize: "inherit",
  },
}));
/**
 *  Use this to turn a string * pickedCards that relate to the answer gaps within the string, into an array of react nodes.
 *
 * @param text The card text to be split. Expects a cards against humanity style input text like with underscores as answer gaps.
 * @param pickedCards The cards that have been picked already. This function will replace answer gaps with these cards.
 * @param onRemove An optional function called when the user intends to remove a picked card/answer. If you don't supply this, the ability won't be given to users.
 */
export const splitCardText = (
  text: string,
  pickedCards: readonly (Card | undefined)[],
  onRemove?: (index: number) => void
) => {
  let currentAnswerIndex = 0;
  let currentText = sanitize(text);
  const parts = [] as React.ReactNode[];
  while (true) {
    const match1 = currentText.match(answerSpaceWithPeriodPattern);
    const match2 = currentText.match(answerSpacePattern);

    if (!match1 && !match2) {
      parts.push(<span key={parts.length}>{currentText}</span>);
      break;
    }

    const match1Index = match1?.index || -1;
    const match2Index = match2?.index || -1;
    const pickedCard = pickedCards[currentAnswerIndex];
    if (match1Index <= match2Index) {
      /* This is the case of a full width line that acts as a line break */

      parts.push(
        <span
          key={parts.length}
          dangerouslySetInnerHTML={{
            __html: currentText.slice(0, match1Index),
          }}
        />
      );

      if (pickedCard) {
        const answerIndex = currentAnswerIndex;
        parts.push(
          <FilledInAnswer
            inline={false}
            key={parts.length}
            text={pickedCard.text.replace(/\.$/, "") + "."}
            onRemove={onRemove ? () => onRemove(answerIndex) : undefined}
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
      currentText = currentText.slice(match1Index + match1![0].length);
    } else if (match2Index < match1Index) {
      /* This is the case of an inline answer that doesn't break the line. */

      parts.push(
        <span
          key={parts.length}
          dangerouslySetInnerHTML={{
            __html: currentText.slice(0, match2Index),
          }}
        />
      );
      if (pickedCard) {
        const answerIndex = currentAnswerIndex;
        parts.push(
          <FilledInAnswer
            inline
            key={parts.length}
            text={pickedCard.text.replace(/\.$/, "")}
            onRemove={onRemove ? () => onRemove(answerIndex) : undefined}
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
      currentText = currentText.slice(match2Index + match2![0].length);
    }
  }
  return parts;
};

/**
 * Use this component to render an answer within the card's text, and to give the user the ability to remove the answer.
 */
const FilledInAnswer = (props: {
  onRemove?: () => void;
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
      {props.text}
      {props.onRemove ? (
        <IconButton size="small" color="secondary" onClick={props.onRemove}>
          <MdClose size="2rem" />
        </IconButton>
      ) : null}
    </Box>
  );
};

/**
 * Responsible for rendering card text and placing picked cards into the answer gaps.
 * Picked cards will also be removable.
 */
export const CardText = React.memo(
  (props: {
    text: string;
    pickedCards: readonly (Card | undefined)[];
    onRemove?: (cardIndex: number) => void;
  }) => {
    const parts = React.useMemo(
      () => splitCardText(props.text, props.pickedCards, props.onRemove),
      [props.onRemove, props.pickedCards, props.text]
    );
    return <span>{parts}</span>;
  }
);
