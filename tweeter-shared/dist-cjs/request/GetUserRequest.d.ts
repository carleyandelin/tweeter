import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
export declare class GetUserRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    alias: string;
    constructor(authToken: AuthTokenDto, alias: string);
}
