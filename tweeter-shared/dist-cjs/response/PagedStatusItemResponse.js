"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagedStatusItemResponse = void 0;
class PagedStatusItemResponse {
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
exports.PagedStatusItemResponse = PagedStatusItemResponse;
