import { FollowService } from "../../service/FollowService";
import { AuthToken, User } from "tweeter-shared";
import { DynamoDAOFactory } from "../../dao/factory/DynamoDAOFactory";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const service = new FollowService(new DynamoDAOFactory());
    const count = await service.getFollowerCount(
      AuthToken.fromDto(body.authToken)!,
      User.fromDto(body.user)!
    );
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, count }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
