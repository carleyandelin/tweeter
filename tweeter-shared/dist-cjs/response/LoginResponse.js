"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponse = void 0;
class LoginResponse {
    success;
    message;
    user;
    authToken;
    constructor(success, message, user, authToken) {
        this.success = success;
        this.message = message;
        this.user = user;
        this.authToken = authToken;
    }
}
exports.LoginResponse = LoginResponse;
