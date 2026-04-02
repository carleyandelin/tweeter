import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { IFollowDAO } from "../interface/IFollowDAO";
import { UserDto } from "tweeter-shared/src/model/dto/UserDto";

const TABLE_NAME = "follows";
const INDEX_NAME = "follows_index";
const REGION = "us-west-2";

export class DynamoFollowDAO implements IFollowDAO {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: REGION })
  );

  async follow(follower: UserDto, followee: UserDto): Promise<void> {
  await this.client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        follower_handle: follower.alias,
        follower_first_name: follower.firstName,
        follower_last_name: follower.lastName,
        follower_image_url: follower.imageUrl,
        followee_handle: followee.alias,
        followee_first_name: followee.firstName,
        followee_last_name: followee.lastName,
        followee_image_url: followee.imageUrl,
      },
    })
  );
}

  async unfollow(followerAlias: string, followeeAlias: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
  }

  async isFollowing(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const result = await this.client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
    return !!result.Item;
  }

  async getFollowees(
    followerAlias: string,
    pageSize: number,
    lastKey?: string
  ): Promise<[UserDto[], boolean]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "follower_handle = :follower",
        ExpressionAttributeValues: {
          ":follower": followerAlias,
        },
        Limit: pageSize,
        ExclusiveStartKey: lastKey
          ? {
              follower_handle: followerAlias,
              followee_handle: lastKey,
            }
          : undefined,
      })
    );

    const items = result.Items || [];
    const users: UserDto[] = items.map((item) => ({
      alias: item.followee_handle,
      firstName: item.followee_first_name ?? "",
      lastName: item.followee_last_name ?? "",
      imageUrl: item.followee_image_url ?? "",
    }));

    const hasMore = !!result.LastEvaluatedKey;
    return [users, hasMore];
  }

  async getFollowers(
    followeeAlias: string,
    pageSize: number,
    lastKey?: string
  ): Promise<[UserDto[], boolean]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: INDEX_NAME,
        KeyConditionExpression: "followee_handle = :followee",
        ExpressionAttributeValues: {
          ":followee": followeeAlias,
        },
        Limit: pageSize,
        ExclusiveStartKey: lastKey
          ? {
              followee_handle: followeeAlias,
              follower_handle: lastKey,
            }
          : undefined,
      })
    );

    const items = result.Items || [];
    const users: UserDto[] = items.map((item) => ({
      alias: item.follower_handle,
      firstName: item.follower_first_name ?? "",
      lastName: item.follower_last_name ?? "",
      imageUrl: item.follower_image_url ?? "",
    }));

    const hasMore = !!result.LastEvaluatedKey;
    return [users, hasMore];
  }

  async getFollowerAliases(followeeAlias: string): Promise<string[]> {
    const aliases: string[] = [];
    let lastKey: Record<string, any> | undefined = undefined;

    do {
      const result: any = await this.client.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: INDEX_NAME,
          KeyConditionExpression: "followee_handle = :followee",
          ExpressionAttributeValues: {
            ":followee": followeeAlias,
          },
          ExclusiveStartKey: lastKey,
        })
      );

      const items = result.Items || [];
      items.forEach((item: any) => aliases.push(item.follower_handle));
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    return aliases;
  }
}
