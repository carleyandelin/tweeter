import { UserService } from "../../service/UserService";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);

    const service = new UserService();

    const [user, authToken] = await service.register(
      body.firstName,
      body.lastName,
      body.alias,
      body.password,
      new Uint8Array(), // fine for now
      body.imageFileExtension
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        user: user.dto,
        authToken: authToken.dto
      })
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: false,
        message: error.message
      })
    };
  }
};