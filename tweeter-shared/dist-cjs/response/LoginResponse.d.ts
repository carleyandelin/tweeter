import { TweeterResponse } from "../net/TweeterResponse";
import { UserDto } from "../model/dto/UserDto";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
export declare class LoginResponse implements TweeterResponse {
    success: boolean;
    message?: string | undefined;
    user?: UserDto | undefined;
    authToken?: AuthTokenDto | undefined;
    constructor(success: boolean, message?: string | undefined, user?: UserDto | undefined, authToken?: AuthTokenDto | undefined);
}
