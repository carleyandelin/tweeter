import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
export declare class LogoutRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    constructor(authToken: AuthTokenDto);
}
