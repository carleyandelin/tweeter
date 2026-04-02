import { AuthToken, Status } from "tweeter-shared";
import { IDAOFactory } from "../dao/factory/IDAOFactory";
import { AuthorizationService } from "./AuthorizationService";

export class StatusService {
  private factory: IDAOFactory;
  private authService: AuthorizationService;

  constructor(factory: IDAOFactory) {
    this.factory = factory;
    this.authService = new AuthorizationService(factory);
  }

  async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.authService.validateToken(authToken.token);
    const [statusDtos, hasMore] = await this.factory
      .getStoryDAO()
      .getStory(userAlias, pageSize, lastItem?.timestamp.toString());
    const statuses = statusDtos.map((dto) => Status.fromDto(dto)!);
    return [statuses, hasMore];
  }

  async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.authService.validateToken(authToken.token);
    const [statusDtos, hasMore] = await this.factory
      .getFeedDAO()
      .getFeed(userAlias, pageSize, lastItem?.timestamp.toString());
    const statuses = statusDtos.map((dto) => Status.fromDto(dto)!);
    return [statuses, hasMore];
  }

  async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const senderAlias = await this.authService.validateToken(authToken.token);

    // Post to sender's story
    await this.factory.getStoryDAO().postToStory(senderAlias, newStatus.dto);

    // Fan out to all followers' feeds
    const followerAliases = await this.factory
      .getFollowDAO()
      .getFollowerAliases(senderAlias);

    if (followerAliases.length > 0) {
      await this.factory
        .getFeedDAO()
        .batchPostToFeed(followerAliases, newStatus.dto);
    }
  }
}