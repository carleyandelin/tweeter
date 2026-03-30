import { FollowService } from "../../service/FollowService";
import { AuthToken, User } from "tweeter-shared";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const service = new FollowService();
    const [followerCount, followeeCount] = await service.unfollow(
      AuthToken.fromDto(body.authToken)!,
      User.fromDto(body.userToUnfollow)!
    );
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, followerCount, followeeCount }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
