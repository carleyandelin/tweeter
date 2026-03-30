import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { StatusDto } from "../model/dto/StatusDto";

export class PostStatusRequest implements TweeterRequest {
  constructor(public authToken: AuthTokenDto, public newStatus: StatusDto) {}
}
