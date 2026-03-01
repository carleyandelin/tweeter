import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { View, Presenter } from "./Presenter";

export interface UserInfoView extends View {
    setFollowerCount: (value: number) => void
    setFolloweeCount: (value: number) => void
    setIsFollower: (value: boolean) => void
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private followService: FollowService;

    constructor(view: UserInfoView) {
        super(view)
        this.followService = new FollowService();
    }

    public async follow (
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return await this.followService.follow(authToken, userToFollow)
    };

    public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return await this.followService.follow(authToken, userToUnfollow)
    };

    public async setNumbFollowers (authToken: AuthToken, displayedUser: User) {
        this.doFailureReportingOperation(async () => {
            this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        }, "get followers count")
    };

    public async setNumbFollowees (authToken: AuthToken, displayedUser: User) {
        this.doFailureReportingOperation(async () => {
            this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        }, "get followees count")
    };

    public async setIsFollowerStatus (authToken: AuthToken | null, currentUser: User | null, displayedUser: User | null) {
        this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                    this.view.setIsFollower(false);
                } else {
                this.view.setIsFollower(
                await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
                );
            }
        }, "determine follower status")
    };

}