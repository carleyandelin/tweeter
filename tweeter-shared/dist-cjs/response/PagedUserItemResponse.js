"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagedUserItemResponse = void 0;
class PagedUserItemResponse {
    success;
    message;
    items;
    hasMore;
    constructor(success, message, items, hasMore) {
        this.success = success;
        this.message = message;
        this.items = items;
        this.hasMore = hasMore;
    }
}
exports.PagedUserItemResponse = PagedUserItemResponse;
