import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { Presenter, View } from "./Presenter";


export interface PostStatusView extends View {
    setIsLoading: (value: boolean) => void
    displayErrorMessage: (message: string) => void
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    setPost: (value: string) => void
    deleteMessage: (message: string) => void
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    service: StatusService

    public constructor(view: PostStatusView) {
        super(view);
        this.service = new StatusService();
    }

    public async submitPost(event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
        event.preventDefault();
        var postingStatusToastId = "";
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMessage(
                "Posting status...",
                0
            );
            const status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken, status)

            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        }, "post the status")
        // finally
        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
    };

}