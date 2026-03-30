import { TweeterResponse } from "../net/TweeterResponse";
import { UserDto } from "../model/dto/UserDto";
export declare class GetUserResponse implements TweeterResponse {
    success: boolean;
    message?: string | undefined;
    user?: UserDto | null | undefined;
    constructor(success: boolean, message?: string | undefined, user?: UserDto | null | undefined);
}
