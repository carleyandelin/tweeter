import { UserService } from "../model.service/UserService";

export interface LoginView {
    setIsLoading: (value: boolean) => void
}

export class LoginPresenter {
    private _view: LoginView
    private service: UserService;

    constructor(view: LoginView) {
        this._view = view;
        this.service = new UserService();
    }

    public async doLogin(alias: string, password: string) {
        try {

        this._view.setIsLoading(true);

        const [user, authToken] = await login(alias, password);

        updateUserInfo(user, user, authToken, rememberMe);

        if (!!props.originalUrl) {
            navigate(props.originalUrl);
        } else {
            navigate(`/feed/${user.alias}`);
        }
        } catch (error) {
        displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
        );
        } finally {
        this._view.setIsLoading(false);
    }
  };

}