import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { IStoryDAO } from "../interface/IStoryDAO";
import { StatusDto } from "tweeter-shared/src/model/dto/StatusDto";

const TABLE_NAME = "story";
const REGION = "us-west-2";

export class DynamoStoryDAO implements IStoryDAO {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: REGION })
  );

  async postToStory(senderAlias: string, status: StatusDto): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          sender_handle: senderAlias,
          timestamp: status.timestamp,
          sender_first_name: status.user.firstName,
          sender_last_name: status.user.lastName,
          sender_image_url: status.user.imageUrl,
          post: status.post,
        },
      })
    );
  }

  async getStory(
    senderAlias: string,
    pageSize: number,
    lastKey?: string
  ): Promise<[StatusDto[], boolean]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "sender_handle = :sender",
        ExpressionAttributeValues: {
          ":sender": senderAlias,
        },
        Limit: pageSize,
        ScanIndexForward: false, // newest first
        ExclusiveStartKey: lastKey
          ? {
              sender_handle: senderAlias,
              timestamp: parseInt(lastKey),
            }
          : undefined,
      })
    );

    const items = result.Items || [];
    const statuses: StatusDto[] = items.map((item) => ({
      post: item.post,
      timestamp: item.timestamp,
      user: {
        alias: item.sender_handle,
        firstName: item.sender_first_name,
        lastName: item.sender_last_name,
        imageUrl: item.sender_image_url,
      },
    }));

    const hasMore = !!result.LastEvaluatedKey;
    return [statuses, hasMore];
  }
}
