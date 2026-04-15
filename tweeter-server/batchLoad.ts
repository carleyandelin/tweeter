import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-west-2" }));

const USERS_TABLE = "users";
const FOLLOWS_TABLE = "follows";
const TARGET_USER = "biguser"; // the user who will have 10K followers. password is "passoff"
const NUM_USERS = 10000;

async function batchWrite(tableName: string, items: object[]) {
  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25).map((item) => ({ PutRequest: { Item: item } }));
    await dynamo.send(new BatchWriteCommand({ RequestItems: { [tableName]: chunk } }));
    await new Promise(resolve => setTimeout(resolve, 200)); // 200ms = 125 writes/sec
  }
}

async function main() {
  const users = [];
  const follows = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const handle = `@testuser${i}`;
    users.push({
      user_handle: handle,
      first_name: "Test",
      last_name: `User${i}`,
      imageUrl: "https://placeholder.com/default.png", // fake profile pic
      password_hash: "fake_hash",
    });

    follows.push({
      follower_handle: handle,
      followee_handle: TARGET_USER,
    });
  }

  console.log("Writing users...");
  await batchWrite(USERS_TABLE, users);
  console.log("Writing follows...");
  await batchWrite(FOLLOWS_TABLE, follows);
  console.log("Done!");
}

main().catch(console.error);