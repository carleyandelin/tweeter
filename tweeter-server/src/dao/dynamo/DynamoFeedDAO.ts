import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { IFeedDAO } from "../interface/IFeedDAO";
import { StatusDto } from "tweeter-shared/src/model/dto/StatusDto";

const TABLE_NAME = "feed";
const REGION = "us-west-2";

export class DynamoFeedDAO implements IFeedDAO {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: REGION })
  );

  async batchPostToFeed(
    receiverAliases: string[],
    status: StatusDto
  ): Promise<void> {
    // DynamoDB batch write limit is 25 items at a time
    const chunkSize = 25;
    for (let i = 0; i < receiverAliases.length; i += chunkSize) {
      const chunk = receiverAliases.slice(i, i + chunkSize);
      const writeRequests = chunk.map((alias) => ({
        PutRequest: {
          Item: {
            receiver_handle: alias,
            timestamp: status.timestamp,
            sender_handle: status.user.alias,
            sender_first_name: status.user.firstName,
            sender_last_name: status.user.lastName,
            sender_image_url: status.user.imageUrl,
            post: status.post,
          },
        },
      }));

      await this.client.send(
        new BatchWriteCommand({
          RequestItems: {
            [TABLE_NAME]: writeRequests,
          },
        })
      );
    }
  }

  async getFeed(
    receiverAlias: string,
    pageSize: number,
    lastKey?: string
  ): Promise<[StatusDto[], boolean]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "receiver_handle = :receiver",
        ExpressionAttributeValues: {
          ":receiver": receiverAlias,
        },
        Limit: pageSize,
        ScanIndexForward: false, // newest first
        ExclusiveStartKey: lastKey
          ? {
              receiver_handle: receiverAlias,
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
