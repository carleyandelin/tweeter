import { AuthToken, User } from "tweeter-shared";
import { IDAOFactory } from "../dao/factory/IDAOFactory";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService {
  private factory: IDAOFactory;
  private authService: AuthorizationService;

  constructor(factory: IDAOFactory) {
    this.factory = factory;
    this.authService = new AuthorizationService(factory);
  }

  async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    await this.authService.validateToken(authToken.token);
    const [userDtos, hasMore] = await this.factory
      .getFollowDAO()
      .getFollowees(userAlias, pageSize, lastItem?.alias);
    const users = userDtos.map((dto) => User.fromDto(dto)!);
    return [users, hasMore];
  }

  async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    await this.authService.validateToken(authToken.token);
    const [userDtos, hasMore] = await this.factory
      .getFollowDAO()
      .getFollowers(userAlias, pageSize, lastItem?.alias);
    const users = userDtos.map((dto) => User.fromDto(dto)!);
    return [users, hasMore];
  }

  async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    await this.authService.validateToken(authToken.token);
    const aliases = await this.factory
      .getFollowDAO()
      .getFollowerAliases(user.alias);
    return aliases.length;
  }

  async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    await this.authService.validateToken(authToken.token);
    const [followees] = await this.factory
      .getFollowDAO()
      .getFollowees(user.alias, 1000);
    return followees.length;
  }

  async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    await this.authService.validateToken(authToken.token);
    return await this.factory
      .getFollowDAO()
      .isFollowing(user.alias, selectedUser.alias);
  }

  async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authService.validateToken(authToken.token);
    const followerDto = await this.factory.getUserDAO().getUser(followerAlias);
    if (!followerDto) throw new Error("User not found");

    await this.factory.getFollowDAO().follow(followerDto, userToFollow.dto);

    const currentFollowerCount = await this.getFollowerCount(authToken, userToFollow);
    const currentFolloweeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [currentFollowerCount + 1, currentFolloweeCount];
  }

  async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authService.validateToken(authToken.token);
    const followerDto = await this.factory.getUserDAO().getUser(followerAlias);
    if (!followerDto) throw new Error("User not found");

    await this.factory.getFollowDAO().unfollow(followerAlias, userToUnfollow.alias);

    // Fetch counts BEFORE the operation would show stale data via GSI,
    // so decrement/increment manually instead of re-querying
    const currentFollowerCount = await this.getFollowerCount(authToken, userToUnfollow);
    const currentFolloweeCount = await this.getFolloweeCount(authToken, userToUnfollow);

    return [Math.max(0, currentFollowerCount - 1), currentFolloweeCount];
  }
}