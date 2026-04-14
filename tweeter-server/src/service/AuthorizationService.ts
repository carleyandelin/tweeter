import { IDAOFactory } from "../dao/factory/IDAOFactory";

export class AuthorizationService {
  private factory: IDAOFactory;

  constructor(factory: IDAOFactory) {
    this.factory = factory;
  }
  //add timestamp checking 
  private static readonly TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
  async validateToken(token: string): Promise<string> {
    const result = await this.factory.getAuthTokenDAO().getAliasByToken(token);
    if (!result) {
      throw new Error("[Unauthorized] Invalid or expired auth token");
    }

    if (Date.now() - result.timestamp > AuthorizationService.TOKEN_EXPIRY_MS) {
      await this.factory.getAuthTokenDAO().deleteToken(token);
      throw new Error("[Unauthorized] Auth token has expired");
    }

    return result.alias;
  }
  
}
