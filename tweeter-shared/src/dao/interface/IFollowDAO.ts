import { UserDto } from "tweeter-shared/src/model/dto/UserDto";

export interface IFollowDAO {
  follow(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
  isFollowing(followerAlias: string, followeeAlias: string): Promise<boolean>;
  getFollowees(followerAlias: string, pageSize: number, lastKey?: string): Promise<[UserDto[], boolean]>;
  getFollowers(followeeAlias: string, pageSize: number, lastKey?: string): Promise<[UserDto[], boolean]>;
  getFollowerAliases(followeeAlias: string): Promise<string[]>;
}
