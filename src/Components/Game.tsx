import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { PlayerInfo } from "../types/DomainModels";

const useStyles = makeStyles({
  container: {
    height: "100%",
    width: "100%",
  },
});

export function Game(props: PlayerInfo) {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h3">Oi</Typography>
    </div>
  );
}
