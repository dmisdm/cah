import React from "react";
import { PlayingCard } from ".";
import { Box } from "@material-ui/core";

export default {
  title: "PlayingCard",
  component: PlayingCard,
};

export const Black = () => (
  <Box padding="1rem">
    <PlayingCard variant="black" text="Blah blah blah" />
  </Box>
);
export const White = () => (
  <Box padding="1rem">
    <PlayingCard variant="white" text="Blah blah blah" />
  </Box>
);
