import { TweeterResponse } from "../net/TweeterResponse";
export declare class IsFollowerResponse implements TweeterResponse {
    success: boolean;
    message?: string | undefined;
    isFollower?: boolean | undefined;
    constructor(success: boolean, message?: string | undefined, isFollower?: boolean | undefined);
}
