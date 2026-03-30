import { TweeterResponse } from "../net/TweeterResponse";
import { UserDto } from "../model/dto/UserDto";

export class GetUserResponse implements TweeterResponse {
  constructor(public success: boolean, public message?: string, public user?: UserDto | null) {}
}
