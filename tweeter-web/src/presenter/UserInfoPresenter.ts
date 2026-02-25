import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";


export interface UserInfoView {
    displayErrorMessage: (message: string) => void
    setFollowerCount: (value: number) => void
    setFolloweeCount: (value: number) => void
    setIsFollower: (value: boolean) => void
}

export class UserInfoPresenter {
    private _view: UserInfoView
    private followService: FollowService;

    constructor(view: UserInfoView) {
        this._view = view;
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
        try {
            this._view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`
            );
        }
    };

    public async setNumbFollowees (authToken: AuthToken, displayedUser: User) {
        try {
            this._view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
            this._view.displayErrorMessage(
               `Failed to get followees count because of exception: ${error}`
            );
        }
    };

    public async setIsFollowerStatus (authToken: AuthToken | null, currentUser: User | null, displayedUser: User | null) {
        try {
            if (currentUser === displayedUser) {
                this._view.setIsFollower(false);
        } else {
            this._view.setIsFollower(
            await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
        }
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`
        );
        }
    };

}