import { TweeterResponse } from "../net/TweeterResponse";
export declare class FollowResponse implements TweeterResponse {
    success: boolean;
    message?: string | undefined;
    followerCount?: number | undefined;
    followeeCount?: number | undefined;
    constructor(success: boolean, message?: string | undefined, followerCount?: number | undefined, followeeCount?: number | undefined);
}
