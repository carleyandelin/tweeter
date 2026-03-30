import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { StatusDto } from "../model/dto/StatusDto";
export declare class PagedStatusItemRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    userAlias: string;
    pageSize: number;
    lastItem: StatusDto | null;
    constructor(authToken: AuthTokenDto, userAlias: string, pageSize: number, lastItem: StatusDto | null);
}
