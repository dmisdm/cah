import { JoinOrCreate } from "./JoinOrCreate";
import { action } from "@storybook/addon-actions";
import React from "react";

const onCreate = action("onCreate");
const onJoin = action("onJoin");
const onBack = action("onBack");
export default {
  title: "JoinOrCreate",
  component: JoinOrCreate,
};

export const Base = () => (
  <JoinOrCreate onCreate={onCreate} onJoin={onJoin} onBack={onBack} />
);
