import { AuthToken, User } from "tweeter-shared"
import { UserService } from "../model.service/UserService";
import { Presenter } from "./Presenter";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { FollowService } from "../model.service/FollowService";


export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {

    protected serviceFactory(): FollowService {
        return new FollowService();
    }

}
