"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagedStatusItemRequest = void 0;
class PagedStatusItemRequest {
    authToken;
    userAlias;
    pageSize;
    lastItem;
    constructor(authToken, userAlias, pageSize, lastItem) {
        this.authToken = authToken;
        this.userAlias = userAlias;
        this.pageSize = pageSize;
        this.lastItem = lastItem;
    }
}
exports.PagedStatusItemRequest = PagedStatusItemRequest;
