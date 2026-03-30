import { StatusService } from "../../service/StatusService";
import { AuthToken, Status } from "tweeter-shared";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const service = new StatusService();
    await service.postStatus(
      AuthToken.fromDto(body.authToken)!,
      Status.fromDto(body.newStatus)!
    );
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
