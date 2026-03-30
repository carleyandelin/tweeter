"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRequest = void 0;
class RegisterRequest {
    firstName;
    lastName;
    alias;
    password;
    imageStringBase64;
    imageFileExtension;
    constructor(firstName, lastName, alias, password, imageStringBase64, imageFileExtension) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.alias = alias;
        this.password = password;
        this.imageStringBase64 = imageStringBase64;
        this.imageFileExtension = imageFileExtension;
    }
}
exports.RegisterRequest = RegisterRequest;
