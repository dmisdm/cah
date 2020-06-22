import React from "react";
import { Box, Card, Typography } from "@material-ui/core";
import { colors } from "./App";
export function PlayingCard(props: {
  variant: "black" | "white";
  text: string;
  className?: string;
}) {
  return (
    <Box
      clone
      height={320}
      width={230}
      padding="1rem"
      borderRadius={16}
      bgcolor={props.variant === "black" ? colors.black : colors.white}
      color={props.variant === "black" ? colors.white : colors.black}
      className={props.className}
    >
      <Card>
        <Typography variant="h6">
          {props.text.replace(/_/g, "______")}
        </Typography>
      </Card>
    </Box>
  );
}
