import { AuthToken, User } from "tweeter-shared";
import { IDAOFactory } from "../dao/factory/IDAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  private factory: IDAOFactory;
  private authService: AuthorizationService;

  constructor(factory: IDAOFactory) {
    this.factory = factory;
    this.authService = new AuthorizationService(factory);
  }

  async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    await this.authService.validateToken(authToken.token);
    const userDto = await this.factory.getUserDAO().getUser(alias);
    return userDto ? User.fromDto(userDto) : null;
  }

  async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const hash = await this.factory.getUserDAO().getPasswordHash(alias);
    if (!hash) throw new Error("Invalid alias or password");

    const match = await bcrypt.compare(password, hash);
    if (!match) throw new Error("Invalid alias or password");

    const userDto = await this.factory.getUserDAO().getUser(alias);
    if (!userDto) throw new Error("Invalid alias or password");

    const token = uuidv4();
    await this.factory.getAuthTokenDAO().createToken(token, alias);

    const user = User.fromDto(userDto)!;
    const authToken = new AuthToken(token, Date.now());
    return [user, authToken];
  }

  async logout(authToken: AuthToken): Promise<void> {
    await this.factory.getAuthTokenDAO().deleteToken(authToken.token);
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Upload image to S3
    const imageStringBase64 = Buffer.from(userImageBytes).toString("base64");
    const imageUrl = await this.factory
      .getS3DAO()
      .putImage(alias, imageStringBase64);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userDto = { firstName, lastName, alias, imageUrl };
    await this.factory.getUserDAO().createUser(userDto, passwordHash);

    // Create auth token
    const token = uuidv4();
    await this.factory.getAuthTokenDAO().createToken(token, alias);

    const user = User.fromDto(userDto)!;
    const authToken = new AuthToken(token, Date.now());
    return [user, authToken];
  }
}