"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserRequest = void 0;
class GetUserRequest {
    authToken;
    alias;
    constructor(authToken, alias) {
        this.authToken = authToken;
        this.alias = alias;
    }
}
exports.GetUserRequest = GetUserRequest;
