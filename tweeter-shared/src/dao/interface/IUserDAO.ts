import { UserDto } from "tweeter-shared/src/model/dto/UserDto";

export interface IUserDAO {
  getUser(alias: string): Promise<UserDto | null>;
  createUser(user: UserDto, passwordHash: string): Promise<void>;
  getPasswordHash(alias: string): Promise<string | null>;
}
