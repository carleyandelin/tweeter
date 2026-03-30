import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";
import {
  PagedStatusItemRequest,
  PostStatusRequest,
} from "tweeter-shared";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = new PagedStatusItemRequest(
      authToken.dto,
      userAlias,
      pageSize,
      lastItem ? lastItem.dto : null
    );
    return this.serverFacade.getMoreStoryItems(request);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = new PagedStatusItemRequest(
      authToken.dto,
      userAlias,
      pageSize,
      lastItem ? lastItem.dto : null
    );
    return this.serverFacade.getMoreFeedItems(request);
  }

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const request = new PostStatusRequest(authToken.dto, newStatus.dto);
    return this.serverFacade.postStatus(request);
  }
}