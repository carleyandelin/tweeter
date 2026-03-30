"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
const PostSegment_1 = require("./PostSegment");
const User_1 = require("./User");
const date_fns_1 = require("date-fns");
class Status {
    _post;
    _user;
    _timestamp;
    _segments;
    constructor(post, user, timestamp) {
        this._post = post;
        this._user = user;
        this._timestamp = timestamp;
        this._segments = this.getPostSegments(post);
    }
    get post() { return this._post; }
    set post(value) { this._post = value; }
    get user() { return this._user; }
    set user(value) { this._user = value; }
    get timestamp() { return this._timestamp; }
    set timestamp(value) { this._timestamp = value; }
    get segments() { return this._segments; }
    set segments(value) { this._segments = value; }
    get formattedDate() {
        return (0, date_fns_1.format)(new Date(this.timestamp), "MMMM dd, yyyy HH:mm:ss");
    }
    get dto() {
        return {
            post: this._post,
            user: this._user.dto,
            timestamp: this._timestamp,
        };
    }
    static fromDto(dto) {
        if (!dto)
            return null;
        const user = User_1.User.fromDto(dto.user);
        if (!user)
            return null;
        return new Status(dto.post, user, dto.timestamp);
    }
    equals(other) {
        return this._user.equals(other.user) && this._timestamp === other._timestamp && this._post === other.post;
    }
    static fromJson(json) {
        if (!json)
            return null;
        const o = JSON.parse(json);
        return new Status(o._post, new User_1.User(o._user._firstName, o._user._lastName, o._user._alias, o._user._imageUrl), o._timestamp);
    }
    toJson() { return JSON.stringify(this); }
    // ── Segment parsing (unchanged from original) ──────────────────────────────
    getPostSegments(post) {
        const segments = [];
        let startIndex = 0;
        for (let ref of Status.getSortedReferences(post)) {
            if (startIndex < ref.startPostion) {
                segments.push(new PostSegment_1.PostSegment(post.substring(startIndex, ref.startPostion), startIndex, ref.startPostion - 1, PostSegment_1.Type.text));
            }
            segments.push(ref);
            startIndex = ref.endPosition;
        }
        if (startIndex < post.length) {
            segments.push(new PostSegment_1.PostSegment(post.substring(startIndex), startIndex, post.length, PostSegment_1.Type.text));
        }
        return segments;
    }
    static getSortedReferences(post) {
        return [...Status.parseUrlReferences(post), ...Status.parseMentionReferences(post), ...Status.parseNewlines(post)]
            .sort((a, b) => a.startPostion - b.startPostion);
    }
    static parseUrlReferences(post) {
        const refs = [];
        let prev = 0;
        for (let url of Status.parseUrls(post)) {
            const start = post.indexOf(url, prev);
            if (start > -1) {
                refs.push(new PostSegment_1.PostSegment(url, start, start + url.length, PostSegment_1.Type.url));
                prev = start + url.length;
            }
        }
        return refs;
    }
    static parseUrls(post) {
        return post.split(/(\s+)/).filter(w => w.startsWith("http://") || w.startsWith("https://"))
            .map(w => w.substring(0, Status.findUrlEndIndex(w)));
    }
    static findUrlEndIndex(word) {
        for (const ext of [".com", ".net", ".org", ".edu", ".mil"]) {
            const i = word.indexOf(ext);
            if (i !== -1)
                return i + 4;
        }
        let i = word.length;
        while (i > 0 && !Status.isLetter(word[i - 1]))
            i--;
        return i;
    }
    static isLetter(c) { return c.length === 1 && /[a-zA-Z]/.test(c); }
    static parseMentionReferences(post) {
        const refs = [];
        let prev = 0;
        for (let mention of post.split(/(\s+)/).filter(w => w.startsWith("@"))) {
            const start = post.indexOf(mention, prev);
            if (start > -1) {
                refs.push(new PostSegment_1.PostSegment(mention, start, start + mention.length, PostSegment_1.Type.alias));
                prev = start + mention.length;
            }
        }
        return refs;
    }
    static parseNewlines(post) {
        const refs = [];
        const regex = /\n/g;
        let match;
        while ((match = regex.exec(post)) !== null) {
            refs.push(new PostSegment_1.PostSegment("\n", match.index, match.index + 1, PostSegment_1.Type.newline));
        }
        return refs;
    }
}
exports.Status = Status;
