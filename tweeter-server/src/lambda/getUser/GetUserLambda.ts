import { UserService } from "../../service/UserService";
import { AuthToken } from "tweeter-shared";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const service = new UserService();
    const user = await service.getUser(AuthToken.fromDto(body.authToken)!, body.alias);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, user: user ? user.dto : null }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
