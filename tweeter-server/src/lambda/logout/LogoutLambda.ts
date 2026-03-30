import { UserService } from "../../service/UserService";
import { AuthToken } from "tweeter-shared";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const service = new UserService();
    await service.logout(AuthToken.fromDto(body.authToken)!);
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
