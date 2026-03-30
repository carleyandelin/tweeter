import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";
import {
  RegisterRequest,
  LoginRequest,
  LogoutRequest,
  GetUserRequest,
} from "tweeter-shared";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    const request = new GetUserRequest(authToken.dto, alias);
    return this.serverFacade.getUser(request);
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const request = new LoginRequest(alias, password);
    return this.serverFacade.login(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request = new LogoutRequest(authToken.dto);
    return this.serverFacade.logout(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");
    const request = new RegisterRequest(
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
      imageFileExtension
    );
    return this.serverFacade.register(request);
  }
}