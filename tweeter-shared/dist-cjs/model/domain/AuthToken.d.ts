import { AuthTokenDto } from "../dto/AuthTokenDto";
export declare class AuthToken {
    private _token;
    private _timestamp;
    static Generate(): AuthToken;
    constructor(token: string, timestamp: number);
    get token(): string;
    set token(value: string);
    get timestamp(): number;
    set timestamp(value: number);
    get dto(): AuthTokenDto;
    static fromDto(dto: AuthTokenDto | null | undefined): AuthToken | null;
    static fromJson(json: string | null | undefined): AuthToken | null;
    toJson(): string;
}
