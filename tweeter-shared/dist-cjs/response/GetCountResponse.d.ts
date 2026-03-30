import { TweeterResponse } from "../net/TweeterResponse";
export declare class GetCountResponse implements TweeterResponse {
    success: boolean;
    message?: string | undefined;
    count?: number | undefined;
    constructor(success: boolean, message?: string | undefined, count?: number | undefined);
}
