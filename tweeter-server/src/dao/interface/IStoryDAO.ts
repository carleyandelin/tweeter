import { StatusDto } from "tweeter-shared/src/model/dto/StatusDto";

export interface IStoryDAO {
  postToStory(senderAlias: string, status: StatusDto): Promise<void>;
  getStory(senderAlias: string, pageSize: number, lastKey?: string): Promise<[StatusDto[], boolean]>;
}
