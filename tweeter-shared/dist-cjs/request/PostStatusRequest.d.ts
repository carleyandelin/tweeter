import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { StatusDto } from "../model/dto/StatusDto";
export declare class PostStatusRequest implements TweeterRequest {
    authToken: AuthTokenDto;
    newStatus: StatusDto;
    constructor(authToken: AuthTokenDto, newStatus: StatusDto);
}
