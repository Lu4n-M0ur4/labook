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

  public findUsersByEmail = async (email:string): Promise<UserDB|undefined> => {
    const [usersDB]: UserDB[]|undefined[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    )
    .where({email});

    return usersDB;
  };  

  public insertUser = async (newUserDB:UserDB):Promise<void>=>{
      await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .insert(newUserDB)
  }



}



