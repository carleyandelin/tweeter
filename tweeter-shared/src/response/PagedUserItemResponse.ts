import { TweeterResponse } from "../net/TweeterResponse";
import { UserDto } from "../model/dto/UserDto";
export class PagedUserItemResponse implements TweeterResponse {
  constructor(
    public success: boolean,
    public message?: string,
    public items?: UserDto[] | null,
    public hasMore?: boolean
  ) {}
}
