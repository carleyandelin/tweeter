

export interface IAuthTokenDAO {
  createToken(token: string, alias: string): Promise<void>;
  getAliasByToken(token: string): Promise<string | null>;
  deleteToken(token: string): Promise<void>;
}

