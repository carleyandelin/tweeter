import { TweeterRequest } from "../net/TweeterRequest";
import { AuthTokenDto } from "../model/dto/AuthTokenDto";
import { UserDto } from "../model/dto/UserDto";
export class PagedUserItemRequest implements TweeterRequest {
  constructor(
    public authToken: AuthTokenDto,
    public userAlias: string,
    public pageSize: number,
    public lastItem: UserDto | null
  ) {}
}
