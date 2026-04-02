import { IDAOFactory } from "../dao/factory/IDAOFactory";

export class AuthorizationService {
  private factory: IDAOFactory;

  constructor(factory: IDAOFactory) {
    this.factory = factory;
  }

  async validateToken(token: string): Promise<string> {
    const alias = await this.factory.getAuthTokenDAO().getAliasByToken(token);
    if (!alias) {
      throw new Error("[Unauthorized] Invalid or expired auth token");
    }
    return alias;
  }
}
