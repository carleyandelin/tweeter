import { TweeterResponse } from "../net/TweeterResponse";
import { StatusDto } from "../model/dto/StatusDto";
export class PagedStatusItemResponse implements TweeterResponse {
  constructor(
    public success: boolean,
    public message?: string,
    public items?: StatusDto[] | null,
    public hasMore?: boolean
  ) {}
}
