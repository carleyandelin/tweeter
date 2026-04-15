import { StatusService } from "../../service/StatusService";
import { AuthToken, Status } from "tweeter-shared";
import { DynamoDAOFactory } from "../../dao/factory/DynamoDAOFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: "us-west-2" });

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const status = Status.fromDto(body.newStatus)!;
    const service = new StatusService(new DynamoDAOFactory());

    await service.postStatus(
      AuthToken.fromDto(body.authToken)!,
      status
    );
    console.log("postStatus service call succeeded");

    await sqsClient.send(new SendMessageCommand({
      QueueUrl: "https://sqs.us-west-2.amazonaws.com/412381763156/PostStatusQueue",
      MessageBody: JSON.stringify({
        authorHandle: status.user.alias,
        authorFirstName: status.user.firstName,
        authorLastName: status.user.lastName,
        authorImageUrl: status.user.imageUrl,
        statusBody: status.post,
        timestamp: status.timestamp,
      }),
    }));
    console.log("SQS message sent successfully");

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
