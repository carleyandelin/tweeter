import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { IAuthTokenDAO } from "../interface/IAuthTokenDAO";

const TABLE_NAME = "auth_tokens";
const REGION = "us-west-2";

export class DynamoAuthTokenDAO implements IAuthTokenDAO {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: REGION })
  );

  async createToken(token: string, alias: string): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          token: token,
          user_handle: alias,
          timestamp: Date.now(),
        },
      })
    );
  }

  async getAliasByToken(token: string): Promise<{ alias: string; timestamp: number } | null> {
  const result = await this.client.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { token: token },
    })
  );

  if (!result.Item) return null;
  return {
    alias: result.Item.user_handle,
    timestamp: result.Item.timestamp,
  };
}

  async deleteToken(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { token: token },
      })
    );
  }
}
