"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRequest = void 0;
class LoginRequest {
    alias;
    password;
    constructor(alias, password) {
        this.alias = alias;
        this.password = password;
    }
}
exports.LoginRequest = LoginRequest;
