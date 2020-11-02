import React from "react";
import { PlayingCard } from ".";
import { Submission } from "../types/DomainModels";
import { CardChooser } from "./CardChooser";
import { CardLayout } from "./CardLayout";
import { CardText } from "./CardText";
import { Box, Typography, Hidden } from "@material-ui/core";

function CardSubmission(props: { card: Submission; width: string }) {
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
    />
  );
}
export function SpectatingChooseSubmission({
  submissions,
}: {
  submissions: Submission[];
  currentIndex: number;
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
          cardData={undefined}
          initialIndex={0}
          cards={submissions}
          Card={CardSubmission}
        />
      }
    />
  );
}
