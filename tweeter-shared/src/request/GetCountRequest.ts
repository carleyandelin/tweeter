import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { UserDto } from "../model/dto/UserDto";

export class GetCountRequest implements TweeterRequest {
  constructor(public authToken: AuthTokenDto, public user: UserDto) {}
}
