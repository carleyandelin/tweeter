import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../service/UserService";

export const handler = async (event: RegisterRequest): Promise<RegisterResponse> => {
  const service = new UserService();
  return service.register(event);
};