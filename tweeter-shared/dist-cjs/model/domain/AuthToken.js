"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthToken = void 0;
const uuid_1 = require("uuid");
class AuthToken {
    _token;
    _timestamp;
    static Generate() {
        return new AuthToken((0, uuid_1.v4)().toString(), Date.now());
    }
    constructor(token, timestamp) {
        this._token = token;
        this._timestamp = timestamp;
    }
    get token() { return this._token; }
    set token(value) { this._token = value; }
    get timestamp() { return this._timestamp; }
    set timestamp(value) { this._timestamp = value; }
    get dto() {
        return { token: this._token, timestamp: this._timestamp };
    }
    static fromDto(dto) {
        if (!dto)
            return null;
        return new AuthToken(dto.token, dto.timestamp);
    }
    static fromJson(json) {
        if (!json)
            return null;
        const o = JSON.parse(json);
        return new AuthToken(o._token, o._timestamp);
    }
    toJson() { return JSON.stringify(this); }
}
exports.AuthToken = AuthToken;
