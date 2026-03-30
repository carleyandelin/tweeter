import { v4 as uuid } from "uuid";
import { AuthTokenDto } from "../dto/AuthTokenDto";

export class AuthToken {
  private _token: string;
  private _timestamp: number;

  public static Generate(): AuthToken {
    return new AuthToken(uuid().toString(), Date.now());
  }

  public constructor(token: string, timestamp: number) {
    this._token = token;
    this._timestamp = timestamp;
  }

  public get token(): string { return this._token; }
  public set token(value: string) { this._token = value; }
  public get timestamp(): number { return this._timestamp; }
  public set timestamp(value: number) { this._timestamp = value; }

  public get dto(): AuthTokenDto {
    return { token: this._token, timestamp: this._timestamp };
  }

  public static fromDto(dto: AuthTokenDto | null | undefined): AuthToken | null {
    if (!dto) return null;
    return new AuthToken(dto.token, dto.timestamp);
  }

  public static fromJson(json: string | null | undefined): AuthToken | null {
    if (!json) return null;
    const o: { _token: string; _timestamp: number } = JSON.parse(json);
    return new AuthToken(o._token, o._timestamp);
  }

  public toJson(): string { return JSON.stringify(this); }
}