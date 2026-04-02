import { UserService } from "../../service/UserService";
import { DynamoDAOFactory } from "../../dao/factory/DynamoDAOFactory";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const service = new UserService(new DynamoDAOFactory());
    const [user, authToken] = await service.register(
      body.firstName,
      body.lastName,
      body.alias,
      body.password,
      new Uint8Array(Buffer.from(body.imageStringBase64, "base64")),
      body.imageFileExtension
    );
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
