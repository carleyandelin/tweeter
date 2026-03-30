"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnfollowResponse = void 0;
class UnfollowResponse {
    success;
    message;
    followerCount;
    followeeCount;
    constructor(success, message, followerCount, followeeCount) {
        this.success = success;
        this.message = message;
        this.followerCount = followerCount;
        this.followeeCount = followeeCount;
    }
}
exports.UnfollowResponse = UnfollowResponse;
