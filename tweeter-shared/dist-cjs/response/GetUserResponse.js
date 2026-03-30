"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserResponse = void 0;
class GetUserResponse {
    success;
    message;
    user;
    constructor(success, message, user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }
}
exports.GetUserResponse = GetUserResponse;
