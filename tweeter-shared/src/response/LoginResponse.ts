import { TweeterResponse } from "../net/TweeterResponse";
import { UserDto } from "../model/dto/UserDto";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";

export class LoginResponse implements TweeterResponse {
  constructor(
    public success: boolean,
    public message?: string,
    public user?: UserDto,
    public authToken?: AuthTokenDto
  ) {}
}
