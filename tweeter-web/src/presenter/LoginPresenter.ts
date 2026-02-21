import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
    setIsLoading: (value: boolean) => void
    displayErrorMessage: (message: string) => void
    updateUserInfo: (user: User, authToken: AuthToken, rememberMe: boolean) => void
    navigate: (value: string) => void
}

export class LoginPresenter {
    private _view: LoginView
    private service: UserService;

    constructor(view: LoginView) {
        this._view = view;
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string | undefined) {
        try {
            this._view.setIsLoading(true);

            const [user, authToken] = await this.service.login(alias, password);

            this._view.updateUserInfo(user, authToken, rememberMe);

            if (originalUrl) {
                this._view.navigate(originalUrl);
            } else {
                this._view.navigate(`/feed/${user.alias}`);
            }
        } catch (error) {
            this._view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
            );
        } finally {
        this._view.setIsLoading(false);
        }
    };

}