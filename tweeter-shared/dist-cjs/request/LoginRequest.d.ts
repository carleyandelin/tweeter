import { TweeterRequest } from "../net/TweeterRequest";
export declare class LoginRequest implements TweeterRequest {
    alias: string;
    password: string;
    constructor(alias: string, password: string);
}
