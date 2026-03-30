"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnfollowRequest = void 0;
class UnfollowRequest {
    authToken;
    userToUnfollow;
    constructor(authToken, userToUnfollow) {
        this.authToken = authToken;
        this.userToUnfollow = userToUnfollow;
    }
}
exports.UnfollowRequest = UnfollowRequest;
