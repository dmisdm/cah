import { Lobby } from "./Lobby";
import React from "react";
import { otherPlayers, defaultPlayer } from "./dummy";

export default {
  title: "Lobby",
  component: Lobby,
};

export const Base = () => (
  <Lobby
    minPlayers={3}
    currentPlayer={defaultPlayer}
    otherPlayers={[]}
    onLeave={console.log}
    code="XAGD"
    leaderId="12355"
  />
);

export const With1OtherPlayers = () => (
  <Lobby
    leaderId="asdsf"
    minPlayers={3}
    currentPlayer={defaultPlayer}
    otherPlayers={[otherPlayers[0]]}
    onLeave={console.log}
    code="XAGD"
  />
);

export const With6OtherPlayers = () => (
  <Lobby
    leaderId={defaultPlayer.id}
    minPlayers={3}
    currentPlayer={defaultPlayer}
    otherPlayers={otherPlayers}
    onLeave={console.log}
    code="XAGD"
  />
);
