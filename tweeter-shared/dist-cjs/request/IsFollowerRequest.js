"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFollowerRequest = void 0;
class IsFollowerRequest {
    authToken;
    user;
    selectedUser;
    constructor(authToken, user, selectedUser) {
        this.authToken = authToken;
        this.user = user;
        this.selectedUser = selectedUser;
    }
}
exports.IsFollowerRequest = IsFollowerRequest;
