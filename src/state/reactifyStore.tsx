import React from "react";
import { persist as mstPersist } from "mst-persist";
import localForage from "localforage";
import { Instance } from "mobx-state-tree";
export function reactifyStore<T>({
  store,
  name,
  persist,
}: {
  store: Instance<T>;
  name: string;
  persist?: boolean;
}) {
  const persistPromise = mstPersist(name, store, {
    storage: localForage,
    jsonify: false,
  });
  const context = React.createContext<Instance<T> | null>(null);

  const StoreProvider: React.SFC = (props) => {
    const [loaded, setLoaded] = React.useState(false);
    React.useEffect(() => {
      let cancelled = false;
      persistPromise.then(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      });
      return () => {
        cancelled = true;
      };
    }, []);
    return loaded ? (
      <context.Provider value={store}>{props.children}</context.Provider>
    ) : null;
  };
  const useStore = () => {
    const store = React.useContext(context);
    if (!store) {
      throw Error(`useStore (${name}) must be used within a StoreProvider.`);
    }
    return store;
  };

  return { StoreProvider, useStore };
}
