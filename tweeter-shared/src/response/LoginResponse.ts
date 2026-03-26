import { TweeterResponse } from "../net/TweeterResponse";


export class LoginResponse implements TweeterResponse {
    success: boolean;
    message?: string;

    constructor(success: boolean, message?: string) {
        this.success = success;
        this.message = message;
    }
}
