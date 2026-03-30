import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";

export class GetUserRequest implements TweeterRequest {
  constructor(public authToken: AuthTokenDto, public alias: string) {}
}
