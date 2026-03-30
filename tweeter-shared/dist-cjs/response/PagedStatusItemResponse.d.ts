import { TweeterResponse } from "../net/TweeterResponse";
import { StatusDto } from "../model/dto/StatusDto";
export declare class PagedStatusItemResponse implements TweeterResponse {
    success: boolean;
    message?: string | undefined;
    items?: StatusDto[] | null | undefined;
    hasMore?: boolean | undefined;
    constructor(success: boolean, message?: string | undefined, items?: StatusDto[] | null | undefined, hasMore?: boolean | undefined);
}
