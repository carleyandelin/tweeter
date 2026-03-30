"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRequest = void 0;
class FollowRequest {
    authToken;
    userToFollow;
    constructor(authToken, userToFollow) {
        this.authToken = authToken;
        this.userToFollow = userToFollow;
    }
}
exports.FollowRequest = FollowRequest;
