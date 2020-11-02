import React from "react";
import { PlayingCard } from ".";
import { Submission } from "../types/DomainModels";
import { CardChooser } from "./CardChooser";
import { CardLayout } from "./CardLayout";
import { CardText } from "./CardText";
import { Box, Button, Typography, Hidden } from "@material-ui/core";

function CardSubmission(props: {
  card: Submission;
  width: string;
  cardData: { onChoose: (submission: Submission) => void };
}) {
  return (
    <PlayingCard
      width={props.width}
      text={
        <CardText
          text={props.card.blackCard.text}
          pickedCards={props.card.picks}
        />
      }
      variant="black"
      footer={
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.cardData.onChoose(props.card)}
          >
            Pick
          </Button>
        </Box>
      }
    />
  );
}
export function ChooseSubmission({
  submissions,
  onChoose,
}: {
  submissions: Submission[];
  onChoose: (submission: Submission) => void;
}) {
  return (
    <CardLayout
      noPadding
      variant="white"
      heading={
        <Box padding="1.5rem">
          <Hidden xsDown>
            <Typography variant="h3">Pick the winning combination!</Typography>
          </Hidden>
          <Hidden smUp>
            <Typography variant="h4">Pick the winning combination!</Typography>
          </Hidden>
        </Box>
      }
      body={
        <CardChooser
          cardData={{
            onChoose,
          }}
          initialIndex={0}
          cards={submissions}
          Card={CardSubmission}
        />
      }
    />
  );
}
