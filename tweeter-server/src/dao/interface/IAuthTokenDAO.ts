

export interface IAuthTokenDAO {
  createToken(token: string, alias: string): Promise<void>;
  getAliasByToken(token: string): Promise<{ alias: string; timestamp: number } | null>;
  deleteToken(token: string): Promise<void>;
}

