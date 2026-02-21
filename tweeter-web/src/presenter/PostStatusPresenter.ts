import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";


export interface PostStatusView {
    setIsLoading: (value: boolean) => void
    displayErrorMessage: (message: string) => void
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    setPost: (value: string) => void
    deleteMessage: (message: string) => void
}

export class PostStatusPresenter {
    _view: PostStatusView
    service: StatusService

    public constructor(view: PostStatusView) {
        this._view = view;
        this.service = new StatusService();
    }

    public async submitPost(event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
        event.preventDefault();

        var postingStatusToastId = "";

        try {
            this._view.setIsLoading(true);
            postingStatusToastId = this._view.displayInfoMessage(
                "Posting status...",
                0
            );

            const status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken, status)

            this._view.setPost("");
            this._view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`
            );
        } finally {
            this._view.deleteMessage(postingStatusToastId);
            this._view.setIsLoading(false);
        }
  };



}