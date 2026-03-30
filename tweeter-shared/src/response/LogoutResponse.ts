import { TweeterResponse } from "../net/TweeterResponse";

export class LogoutResponse implements TweeterResponse {
  constructor(public success: boolean, public message?: string) {}
}
