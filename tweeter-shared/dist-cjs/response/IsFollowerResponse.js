"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFollowerResponse = void 0;
class IsFollowerResponse {
    success;
    message;
    isFollower;
    constructor(success, message, isFollower) {
        this.success = success;
        this.message = message;
        this.isFollower = isFollower;
    }
}
exports.IsFollowerResponse = IsFollowerResponse;
