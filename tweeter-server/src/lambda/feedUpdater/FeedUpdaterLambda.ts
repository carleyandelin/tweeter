import { SQSEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-2" }));
const FEED_TABLE = "feed"; // match your actual table name

export const handler = async (event: SQSEvent): Promise<void> => {
  // Collect all feed items from this SQS batch
  const feedItems = event.Records.map((record) => {
    const { followerHandle, authorHandle, authorFirstName, authorLastName, authorImageUrl, statusBody, timestamp } = JSON.parse(record.body);
      return {
        PutRequest: {
          Item: {
            receiver_handle: followerHandle,
            timestamp: timestamp,
            post: statusBody,
            sender_handle: authorHandle,
            sender_first_name: authorFirstName,
            sender_last_name: authorLastName,
            sender_image_url: authorImageUrl,
          },
        },
      };
  });

  // DynamoDB batch write max is 25 — chunk if needed
  for (let i = 0; i < feedItems.length; i += 25) {
    const chunk = feedItems.slice(i, i + 25);
    await dynamo.send(new BatchWriteCommand({
      RequestItems: {
        [FEED_TABLE]: chunk,
      },
    }));
  }
};