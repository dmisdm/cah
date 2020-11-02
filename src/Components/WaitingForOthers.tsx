import React from "react";
import { CardLayout } from "./CardLayout";
import { Typography, CircularProgress, Box } from "@material-ui/core";
import { Padding } from ".";
/**
 * Component that renders the state where a user has selected their cards but is waiting for others to decide
 */
export function WaitingForOthers() {
  return (
    <CardLayout
      variant="black"
      heading={null}
      body={
        <Box
          height="100%"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography variant="h4" align="center">
            Waiting for others to pick
          </Typography>
          <Padding />
          <CircularProgress />
        </Box>
      }
    />
  );
}
