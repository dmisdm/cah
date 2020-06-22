import { createInstance } from "localforage";
import { v4 } from "uuid";
import * as t from "io-ts";

export const sessionSchema = t.intersection([
  t.type({
    roomId: t.string,
  }),
  t.partial({ id: t.string }),
]);
export type Session = t.TypeOf<typeof sessionSchema>;
export const userSchema = t.intersection([
  t.type({
    id: t.string,
    password: t.string,
    name: t.string,
  }),
  t.partial({
    session: sessionSchema,
  }),
]);

export type User = t.TypeOf<typeof userSchema>;
const userKey = "user";
export class LocalPersistence {
  private localForage: LocalForage;

  constructor() {
    this.localForage = createInstance({ name: "cah" });
  }

  public getCurrentUser = async (): Promise<User> => {
    const user = userSchema.decode(await this.localForage.getItem(userKey));

    if (user._tag === "Right") {
      return user.right;
    } else {
      const user = {
        id: v4(),
        password: v4(),
        name: "",
      };
      await this.localForage.setItem(userKey, user);
      return user;
    }
  };

  public updateUserName = async (name: string) =>
    this.localForage.setItem(userKey, {
      ...(await this.getCurrentUser()),
      name,
    });
  public updateSession = async (
    session: t.TypeOf<typeof sessionSchema> | null
  ) => {
    this.localForage.setItem(userKey, {
      ...(await this.getCurrentUser()),
      session,
    });
  };
}

export const localPersistence = new LocalPersistence();
