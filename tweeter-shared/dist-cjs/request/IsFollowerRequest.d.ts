import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { UserDto } from "../model/dto/UserDto";
export declare class IsFollowerRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    user: UserDto;
    selectedUser: UserDto;
    constructor(authToken: AuthTokenDto, user: UserDto, selectedUser: UserDto);
}
