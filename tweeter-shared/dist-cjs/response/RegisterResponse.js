"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterResponse = void 0;
class RegisterResponse {
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
exports.RegisterResponse = RegisterResponse;
