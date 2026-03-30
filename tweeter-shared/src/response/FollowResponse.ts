import { TweeterResponse } from "../net/TweeterResponse";

export class FollowResponse implements TweeterResponse {
  constructor(
    public success: boolean,
    public message?: string,
    public followerCount?: number,
    public followeeCount?: number
  ) {}
}
