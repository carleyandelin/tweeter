import { SQSEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { QueryCommandOutput } from "@aws-sdk/client-dynamodb";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-2" }));
const sqs = new SQSClient({ region: "us-west-2" });

const FOLLOWS_TABLE = "follows"; // match your actual table name
const FEED_QUEUE_URL = "https://sqs.us-west-2.amazonaws.com/412381763156/FeedUpdateQueue";
const FOLLOWER_BATCH_SIZE = 25; // SQS batch max


export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const { authorHandle, authorFirstName, authorLastName, authorImageUrl, statusBody, timestamp } = JSON.parse(record.body);

    // Paginate through ALL followers of this author
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    do {
      const result: QueryCommandOutput = await dynamo.send(new QueryCommand({
        TableName: FOLLOWS_TABLE,
        IndexName: "followee_handle-index", // your GSI name — see note below
        KeyConditionExpression: "followee_handle = :author",
        ExpressionAttributeValues: { ":author": authorHandle },
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: 500,
      }));

      const followers = result.Items ?? [];
      lastEvaluatedKey = result.LastEvaluatedKey;

      // Send followers in batches of 25 to FeedUpdateQueue
      for (let i = 0; i < followers.length; i += FOLLOWER_BATCH_SIZE) {
        const batch = followers.slice(i, i + FOLLOWER_BATCH_SIZE);

        await sqs.send(new SendMessageBatchCommand({
          QueueUrl: FEED_QUEUE_URL,
          Entries: batch.map((follower: Record<string, any>, idx: number) => ({
            Id: String(idx),
            MessageBody: JSON.stringify({
              followerHandle: follower.follower_handle,
              authorHandle,
              authorFirstName,
              authorLastName,
              authorImageUrl,
              statusBody,
              timestamp,
            }),
          })),
        }));
      }
    } while (lastEvaluatedKey);
  }
};
