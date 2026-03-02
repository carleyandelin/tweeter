import { AuthToken } from "tweeter-shared"
import { UserService } from "../model.service/UserService"
import { Presenter, MessageView } from "./Presenter"


export interface AppNavbarView extends MessageView {
    clearUserInfo: () => void
    navigate: (value: string) => void
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    service: UserService
    
    public constructor(view: AppNavbarView) {
        super(view);
        this.service = new UserService();
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
        this.doFailureReportingOperation(async () => {
            await this.service.logout(authToken!);
            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        }, "log user out")
    };

}