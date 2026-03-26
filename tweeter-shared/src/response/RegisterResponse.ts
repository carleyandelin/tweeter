import { TweeterResponse } from "../net/TweeterResponse";
import { User } from "../model/domain/User";
import { AuthToken } from "../model/domain/AuthToken";

export class RegisterResponse implements TweeterResponse {
    constructor(
        public success: boolean,
        public message?: string,
        public user?: User,
        public authToken?: AuthToken
    ) {}
}