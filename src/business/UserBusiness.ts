import { UserDatabase } from "../database/UserDatabase";
import { GetUsersOutputDTO } from "../dtos/users/getUsers.dto";
import { User, UserModel } from "../models/User";

export class UserBusiness {
    constructor (private userDatabase: UserDatabase){}


  public findUsers = async (): Promise<GetUsersOutputDTO> => {

    const usersDB = await this.userDatabase.findUsers();

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
        createdAt: user.getCreatedAt(),
      };

      return usersModel;
    });

    const output: GetUsersOutputDTO = users;
    return output;
  };
}
