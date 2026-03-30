"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    _firstName;
    _lastName;
    _alias;
    _imageUrl;
    constructor(firstName, lastName, alias, imageUrl) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._alias = alias;
        this._imageUrl = imageUrl;
    }
    get firstName() { return this._firstName; }
    set firstName(value) { this._firstName = value; }
    get lastName() { return this._lastName; }
    set lastName(value) { this._lastName = value; }
    get name() { return `${this.firstName} ${this.lastName}`; }
    get alias() { return this._alias; }
    set alias(value) { this._alias = value; }
    get imageUrl() { return this._imageUrl; }
    set imageUrl(value) { this._imageUrl = value; }
    get dto() {
        return {
            firstName: this._firstName,
            lastName: this._lastName,
            alias: this._alias,
            imageUrl: this._imageUrl,
        };
    }
    static fromDto(dto) {
        if (!dto)
            return null;
        return new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl);
    }
    equals(other) { return this._alias === other._alias; }
    static fromJson(json) {
        if (!json)
            return null;
        const o = JSON.parse(json);
        return new User(o._firstName, o._lastName, o._alias, o._imageUrl);
    }
    toJson() { return JSON.stringify(this); }
}
exports.User = User;
