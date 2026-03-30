"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCountRequest = void 0;
class GetCountRequest {
    authToken;
    user;
    constructor(authToken, user) {
        this.authToken = authToken;
        this.user = user;
    }
}
exports.GetCountRequest = GetCountRequest;
