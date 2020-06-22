import { types } from "mobx-state-tree";
import { reactifyStore } from "./reactifyStore";

const User = types
  .model("User", {
    name: types.string,
  })
  .actions((self) => ({
    updateName: (name: string) => (self.name = name),
  }));

const userStore = User.create({
  name: "",
});

const { StoreProvider, useStore } = reactifyStore({
  store: userStore,
  name: "user",
  persist: true,
});

export const UserStoreProvider = StoreProvider;
export const useUserStore = useStore;
