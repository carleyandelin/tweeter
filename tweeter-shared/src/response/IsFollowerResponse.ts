import { TweeterResponse } from "../net/TweeterResponse";

export class IsFollowerResponse implements TweeterResponse {
  constructor(public success: boolean, public message?: string, public isFollower?: boolean) {}
}
