import { UserDatabase } from "../database/UserDatabase";
import { GetUsersOutputDTO } from "../dtos/users/getUsers.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { USER_ROLES, User, UserDB, UserModel } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

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
  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;

    const id = this.idGenerator.generate();

    const newUser = new User(
      id,
      name,
      email,
      password,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );
    const newUserDB: UserDB = newUser.toDBModel();
    await this.userDatabase.insertUser(newUserDB);

    const payload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const output: SignupOutputDTO = {
      token,
    };

    return output;
  };
}
