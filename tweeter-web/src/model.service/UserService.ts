import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";
import { RegisterRequest } from "tweeter-shared";

export class UserService implements Service {

  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const request = new RegisterRequest(
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
      imageFileExtension
    );

    const response = await this.serverFacade.register(request);

    if (!response.success) {
      throw new Error(response.message);
    }

    const user = new User(
    response.user!.firstName,
    response.user!.lastName,
    response.user!.alias,
    response.user!.imageUrl
  );

    const authToken = new AuthToken(
      response.authToken!.token,
      response.authToken!.timestamp
    );

    return [user, authToken];
  };   
}
