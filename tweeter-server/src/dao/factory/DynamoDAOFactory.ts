import { IDAOFactory } from "./IDAOFactory";
import { IUserDAO } from "../interface/IUserDAO";
import { IAuthTokenDAO } from "../interface/IAuthTokenDAO";
import { IFollowDAO } from "../interface/IFollowDAO";
import { IFeedDAO } from "../interface/IFeedDAO";
import { IStoryDAO } from "../interface/IStoryDAO";
import { IS3DAO } from "../interface/IS3DAO";
import { DynamoUserDAO } from "../dynamo/DynamoUserDAO";
import { DynamoAuthTokenDAO } from "../dynamo/DynamoAuthTokenDAO";
import { DynamoFollowDAO } from "../dynamo/DynamoFollowDAO";
import { DynamoFeedDAO } from "../dynamo/DynamoFeedDAO";
import { DynamoStoryDAO } from "../dynamo/DynamoStoryDAO";
import { S3DAO } from "../s3/S3DAO";

export class DynamoDAOFactory implements IDAOFactory {
  getUserDAO(): IUserDAO {
    return new DynamoUserDAO();
  }
  getAuthTokenDAO(): IAuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }
  getFollowDAO(): IFollowDAO {
    return new DynamoFollowDAO();
  }
  getFeedDAO(): IFeedDAO {
    return new DynamoFeedDAO();
  }
  getStoryDAO(): IStoryDAO {
    return new DynamoStoryDAO();
  }
  getS3DAO(): IS3DAO {
    return new S3DAO();
  }
}
