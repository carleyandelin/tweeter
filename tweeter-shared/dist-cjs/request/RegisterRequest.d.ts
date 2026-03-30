import { TweeterRequest } from "../net/TweeterRequest";
export declare class RegisterRequest implements TweeterRequest {
    firstName: string;
    lastName: string;
    alias: string;
    password: string;
    imageStringBase64: string;
    imageFileExtension: string;
    constructor(firstName: string, lastName: string, alias: string, password: string, imageStringBase64: string, imageFileExtension: string);
}
