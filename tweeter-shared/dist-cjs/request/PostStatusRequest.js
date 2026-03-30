"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostStatusRequest = void 0;
class PostStatusRequest {
    authToken;
    newStatus;
    constructor(authToken, newStatus) {
        this.authToken = authToken;
        this.newStatus = newStatus;
    }
}
exports.PostStatusRequest = PostStatusRequest;
