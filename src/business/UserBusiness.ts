import { UserDatabase } from "../database/UserDatabase";
import { GetUsersOutputDTO } from "../dtos/users/getUsers.dto";
import { LoguinInputDTO, LoguinOutputDTO } from "../dtos/users/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { NotFoundError } from "../errors/NotFoundError";
import { USER_ROLES, User, UserDB, UserModel } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
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

    const hashedPassword = await this.hashManager.hash(password);

    const id = this.idGenerator.generate();

    const newUser = new User(
      id,
      name,
      email,
      hashedPassword,
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
  public loguin = async (input: LoguinInputDTO): Promise<LoguinOutputDTO> => {
    const { email, password } = input;

    const userDB = await this.userDatabase.findUsersByEmail(email);

    if (!userDB) {
      throw new NotFoundError("'email' ou 'senha' incorretos");
    }

    const hashedPassword = userDB.password;
    const isPassword = await this.hashManager.compare(password, hashedPassword);

    if (!isPassword) {
      throw new NotFoundError("'email' ou 'senha' incorretos");
    }
    
    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    const tokenPayload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };

    const token = this.tokenManager.createToken(tokenPayload);

    const output: LoguinOutputDTO = {
      token,
    };

    return output;
  };
}
