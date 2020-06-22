import React from "react";
import { ChooseWhiteCard } from "../Components/ChooseWhiteCard";
import {
  otherPlayers,
  defaultPlayer,
  blackCard,
  doublePickBlackCard,
} from "./dummy";

export default {
  title: "ChooseWhiteCard",
  component: ChooseWhiteCard,
};

export const SinglePickBlackCard = () => (
  <ChooseWhiteCard
    onConfirm={console.log}
    blackCard={blackCard}
    otherPlayers={otherPlayers}
    currentPlayer={defaultPlayer}
    leaderId={defaultPlayer.id}
  />
);

export const DoublePickBlackCard = () => (
  <ChooseWhiteCard
    onConfirm={console.log}
    blackCard={doublePickBlackCard}
    otherPlayers={otherPlayers}
    currentPlayer={defaultPlayer}
    leaderId={defaultPlayer.id}
  />
);
