import { TweeterResponse } from "../net/TweeterResponse";

export class GetCountResponse implements TweeterResponse {
  constructor(public success: boolean, public message?: string, public count?: number) {}
}
