import { Buffer } from "buffer"
import { User, AuthToken, FakeData } from "tweeter-shared"
import { UserService } from "../model.service/UserService"


export interface RegisterView {
    setIsLoading: (value: boolean) => void
    setRememberMe: (value: boolean) => void
    displayErrorMessage: (message: string) => void
    updateUserInfo: (user: User, authToken: AuthToken, rememberMe: boolean) => void
    navigate: (value: string) => void
}

export class RegisterPresenter {
    private _view: RegisterView;
    private service: UserService;

    public constructor(view: RegisterView) {
        this._view = view;
        this.service = new UserService();
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string,
         imageBytes: Uint8Array<ArrayBufferLike>, imageFileExtension: string, rememberMe: boolean) {
        try {
            this._view.setIsLoading(true);

            const [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );

            this._view.updateUserInfo(user, authToken, rememberMe);
            this._view.navigate(`/feed/${user.alias}`);
        } catch (error) {
            this._view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        } finally {
            this._view.setIsLoading(false);
        }
    };

}