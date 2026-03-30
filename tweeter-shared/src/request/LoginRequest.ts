import { TweeterRequest } from "../net/TweeterRequest";

export class LoginRequest implements TweeterRequest {
  constructor(public alias: string, public password: string) {}
}
