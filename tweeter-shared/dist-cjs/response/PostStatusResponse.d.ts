import { TweeterResponse } from "../net/TweeterResponse";
export declare class PostStatusResponse implements TweeterResponse {
    success: boolean;
    message?: string | undefined;
    constructor(success: boolean, message?: string | undefined);
}
