import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";

export class LogoutRequest implements TweeterRequest {
  constructor(public authToken: AuthTokenDto) {}
}
