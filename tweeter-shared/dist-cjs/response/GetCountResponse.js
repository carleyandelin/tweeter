"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCountResponse = void 0;
class GetCountResponse {
    success;
    message;
    count;
    constructor(success, message, count) {
        this.success = success;
        this.message = message;
        this.count = count;
    }
}
exports.GetCountResponse = GetCountResponse;
