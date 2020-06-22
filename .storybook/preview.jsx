import { addDecorator } from "@storybook/react";
import { ProvideCAHThemeAndBaseline } from "../src/theme";
import { UserStoreProvider } from "../src/state/user";
import { SessionStoreProvider } from "../src/state/session";
import React from "react";
export const baseDecorator = (storyFn) => (
  <UserStoreProvider>
    <SessionStoreProvider>
      <ProvideCAHThemeAndBaseline>{storyFn()}</ProvideCAHThemeAndBaseline>
    </SessionStoreProvider>
  </UserStoreProvider>
);

addDecorator(baseDecorator);
