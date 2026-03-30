import { TweeterResponse } from "../net/TweeterResponse";
import { UserDto } from "../model/dto/UserDto";
export declare class PagedUserItemResponse implements TweeterResponse {
    success: boolean;
    message?: string | undefined;
    items?: UserDto[] | null | undefined;
    hasMore?: boolean | undefined;
    constructor(success: boolean, message?: string | undefined, items?: UserDto[] | null | undefined, hasMore?: boolean | undefined);
}
