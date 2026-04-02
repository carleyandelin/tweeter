import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { IUserDAO } from "../interface/IUserDAO";
import { UserDto } from "tweeter-shared/src/model/dto/UserDto";

const TABLE_NAME = "users";
const REGION = "us-west-2"; 

export class DynamoUserDAO implements IUserDAO {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: REGION })
  );

  async getUser(alias: string): Promise<UserDto | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { user_handle: alias },
      })
    );

    if (!result.Item) return null;

    return {
      alias: result.Item.user_handle,
      firstName: result.Item.first_name,
      lastName: result.Item.last_name,
      imageUrl: result.Item.image_url,
    };
  }

  async createUser(user: UserDto, passwordHash: string): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          user_handle: user.alias,
          first_name: user.firstName,
          last_name: user.lastName,
          image_url: user.imageUrl,
          password_hash: passwordHash,
        },
      })
    );
  }

  async getPasswordHash(alias: string): Promise<string | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { user_handle: alias },
      })
    );

    return result.Item ? result.Item.password_hash : null;
  }
}
