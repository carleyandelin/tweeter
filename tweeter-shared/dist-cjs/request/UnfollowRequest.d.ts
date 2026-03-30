import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { UserDto } from "../model/dto/UserDto";
export declare class UnfollowRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    userToUnfollow: UserDto;
    constructor(authToken: AuthTokenDto, userToUnfollow: UserDto);
}
