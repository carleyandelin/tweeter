import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { UserDto } from "../model/dto/UserDto";
export declare class PagedUserItemRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    userAlias: string;
    pageSize: number;
    lastItem: UserDto | null;
    constructor(authToken: AuthTokenDto, userAlias: string, pageSize: number, lastItem: UserDto | null);
}
