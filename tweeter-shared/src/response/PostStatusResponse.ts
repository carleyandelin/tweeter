import { TweeterResponse } from "../net/TweeterResponse";

export class PostStatusResponse implements TweeterResponse {
  constructor(public success: boolean, public message?: string) {}
}
