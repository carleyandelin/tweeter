import { StatusDto } from "tweeter-shared/src/model/dto/StatusDto";

export interface IFeedDAO {
  batchPostToFeed(receiverAliases: string[], status: StatusDto): Promise<void>;
  getFeed(receiverAlias: string, pageSize: number, lastKey?: string): Promise<[StatusDto[], boolean]>;
}
