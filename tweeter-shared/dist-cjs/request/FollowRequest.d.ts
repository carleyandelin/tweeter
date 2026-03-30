import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { UserDto } from "../model/dto/UserDto";
export declare class FollowRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    userToFollow: UserDto;
    constructor(authToken: AuthTokenDto, userToFollow: UserDto);
}
