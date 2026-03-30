import { FollowService } from "../../service/FollowService";
import { AuthToken, User } from "tweeter-shared";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const service = new FollowService();
    const [users, hasMore] = await service.loadMoreFollowers(
      AuthToken.fromDto(body.authToken)!,
      body.userAlias,
      body.pageSize,
      body.lastItem ? User.fromDto(body.lastItem) : null
    );
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, items: users.map((u) => u.dto), hasMore }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
