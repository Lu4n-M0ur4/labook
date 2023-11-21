import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  public findUsers = async (): Promise<UserDB[]> => {
    const usersDB: UserDB[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    );

    return usersDB;
  };
}
