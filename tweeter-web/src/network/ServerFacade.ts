import {
  User,
  UserDto,
  AuthToken,
  AuthTokenDto,
  Status,
  StatusDto,
  FakeData,
} from "tweeter-shared";
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  GetUserRequest,
  GetUserResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  GetCountRequest,
  GetCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  FollowRequest,
  FollowResponse,
  UnfollowRequest,
  UnfollowResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PostStatusRequest,
  PostStatusResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  // TODO: Replace with your deployed API Gateway URL
  private SERVER_URL = "https://255wg6d684.execute-api.us-west-2.amazonaws.com/dev";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // ── Auth ──────────────────────────────────────────────

  public async register(
    request: RegisterRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(request, "/register");
    return this.extractUserAndAuthToken(response);
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/login");
    return this.extractUserAndAuthToken(response);
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, "/logout");
    if (!response.success) {
      throw new Error(response.message ?? "Logout failed");
    }
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get");
    if (!response.success) {
      throw new Error(response.message ?? "Failed to get user");
    }
    return response.user ? User.fromDto(response.user as UserDto) : null;
  }

  // ── Follow ────────────────────────────────────────────

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.getPagedUsers(request, "/follower/list");
  }

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.getPagedUsers(request, "/followee/list");
  }

  public async getFollowerCount(request: GetCountRequest): Promise<number> {
    return this.getCount(request, "/follower/count");
  }

  public async getFolloweeCount(request: GetCountRequest): Promise<number> {
    return this.getCount(request, "/followee/count");
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follower/status");
    if (!response.success) {
      throw new Error(response.message ?? "Failed to get follower status");
    }
    return response.isFollower!;
  }

  public async follow(
    request: FollowRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow");
    if (!response.success) {
      throw new Error(response.message ?? "Follow failed");
    }
    return [response.followerCount!, response.followeeCount!];
  }

  public async unfollow(
    request: UnfollowRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      UnfollowResponse
    >(request, "/unfollow");
    if (!response.success) {
      throw new Error(response.message ?? "Unfollow failed");
    }
    return [response.followerCount!, response.followeeCount!];
  }

  // ── Status ────────────────────────────────────────────

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    return this.getPagedStatuses(request, "/story/list");
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    return this.getPagedStatuses(request, "/feed/list");
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/status/post");
    if (!response.success) {
      throw new Error(response.message ?? "Post status failed");
    }
  }

  // ── Private Helpers ───────────────────────────────────

  private extractUserAndAuthToken(
    response: RegisterResponse | LoginResponse
  ): [User, AuthToken] {
    if (!response.success || !response.user || !response.authToken) {
      throw new Error(response.message ?? "Authentication failed");
    }
    const user = User.fromDto(response.user as UserDto);
    const authToken = AuthToken.fromDto(response.authToken as AuthTokenDto);
    if (!user || !authToken) {
      throw new Error("Invalid user or auth token in response");
    }
    return [user, authToken];
  }

  private async getPagedUsers(
    request: PagedUserItemRequest,
    endpoint: string
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, endpoint);
    if (!response.success) {
      throw new Error(response.message ?? `Failed to load from ${endpoint}`);
    }
    const items = response.items
      ? response.items.map((dto) => User.fromDto(dto) as User)
      : [];
    return [items, response.hasMore!];
  }

  private async getPagedStatuses(
    request: PagedStatusItemRequest,
    endpoint: string
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, endpoint);
    if (!response.success) {
      throw new Error(response.message ?? `Failed to load from ${endpoint}`);
    }
    const items = response.items
      ? response.items.map((dto) => Status.fromDto(dto) as Status)
      : [];
    return [items, response.hasMore!];
  }

  private async getCount(
    request: GetCountRequest,
    endpoint: string
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetCountRequest,
      GetCountResponse
    >(request, endpoint);
    if (!response.success) {
      throw new Error(response.message ?? `Failed to get count from ${endpoint}`);
    }
    return response.count!;
  }
}