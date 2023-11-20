import { GetUsersOutputDTO } from "../dtos/users/getUsers.dto";
import { User, UserDb, UserModel } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  public findUsers = async (): Promise<UserModel[]> => {
    const usersDB: UserDb[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    );

    
    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
      );

      const usersModel: UserModel = {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        password: user.getPassword(),
        role: user.getRole(),
        createdAt: user.getCreatedAt()
      };

      return usersModel;
    });
console.log(users);

    const output: GetUsersOutputDTO = users;

    return output;
  };
}
