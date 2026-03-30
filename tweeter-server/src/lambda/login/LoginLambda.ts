import { UserService } from "../../service/UserService";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const service = new UserService();
    const [user, authToken] = await service.login(body.alias, body.password);
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, user: user.dto, authToken: authToken.dto }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
