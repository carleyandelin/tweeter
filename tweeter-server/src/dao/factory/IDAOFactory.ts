import { IUserDAO } from "../interface/IUserDAO";
import { IAuthTokenDAO } from "../interface/IAuthTokenDAO";
import { IFollowDAO } from "../interface/IFollowDAO";
import { IFeedDAO } from "../interface/IFeedDAO";
import { IStoryDAO } from "../interface/IStoryDAO";
import { IS3DAO } from "../interface/IS3DAO";

export interface IDAOFactory {
  getUserDAO(): IUserDAO;
  getAuthTokenDAO(): IAuthTokenDAO;
  getFollowDAO(): IFollowDAO;
  getFeedDAO(): IFeedDAO;
  getStoryDAO(): IStoryDAO;
  getS3DAO(): IS3DAO;
}
