"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowResponse = void 0;
class FollowResponse {
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
exports.FollowResponse = FollowResponse;
