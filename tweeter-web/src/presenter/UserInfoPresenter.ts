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
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server
        const followerCount = await this.followService.getFollowerCount(authToken, userToFollow);
        const followeeCount = await this.followService.getFolloweeCount(authToken, userToFollow);

        return [followerCount, followeeCount];
    };

    public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server

        const followerCount = await this.followService.getFollowerCount(authToken, userToUnfollow);
        const followeeCount = await this.followService.getFolloweeCount(authToken, userToUnfollow);

        return [followerCount, followeeCount];
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