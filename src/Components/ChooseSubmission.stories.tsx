import React from "react";
import { ChooseSubmission } from "./ChooseSubmission";
import {
  otherPlayers,
  defaultPlayer,
  blackCard,
  doublePickBlackCard,
  dummySubmissions,
} from "./dummy";

export default {
  title: "ChooseSubmission",
  component: ChooseSubmission,
};

export const Base = () => (
  <ChooseSubmission onChoose={console.log} submissions={dummySubmissions} />
);
