import { types } from "mobx-state-tree";
import { reactifyStore } from "./reactifyStore";

const Session = types.model("session", {
  roomCode: types.maybe(types.string),
});

const sessionStore = Session.create({});

const reactifiedStore = reactifyStore({
  store: sessionStore,
  name: "session",
  persist: true,
});

export const useSessionStore = reactifiedStore.useStore;
export const SessionStoreProvider = reactifiedStore.StoreProvider;
