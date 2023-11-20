import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  public findUsers = async () => {
    const output = await BaseDatabase.connection(UserDatabase.TABLE_USERS);


    return output;
  };
}
