import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { StatusDto } from "../model/dto/StatusDto";
export class PagedStatusItemRequest implements TweeterRequest {
  constructor(
    public authToken: AuthTokenDto,
    public userAlias: string,
    public pageSize: number,
    public lastItem: StatusDto | null
  ) {}
}
