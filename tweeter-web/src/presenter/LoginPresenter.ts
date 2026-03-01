import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
    setIsLoading: (value: boolean) => void
    updateUserInfo: (user: User, authToken: AuthToken, rememberMe: boolean) => void
    navigate: (value: string) => void
}

export class LoginPresenter extends Presenter<LoginView> {
    private service: UserService;

    constructor(view: LoginView) {
        super(view);
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string | undefined) {
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.service.login(alias, password);

            this.view.updateUserInfo(user, authToken, rememberMe);

            if (originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate(`/feed/${user.alias}`);
            }
        }, "log user in")
        // finally block goes here
        this.view.setIsLoading(false);
    };

}