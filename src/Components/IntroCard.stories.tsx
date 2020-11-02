import { IntroCard } from "./IntroCard";
import React from "react";

export default {
  title: "IntroCard",
  component: IntroCard,
};

export const Basic = () => <IntroCard onNext={console.log} />;
