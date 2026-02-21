import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";


export interface UserNavigationView {}

export class UserNavigationPresenter {
    private _view: UserNavigationView
    private userService: UserService;

    constructor(view: UserNavigationView) {
        this._view = view;
        this.userService = new UserService();
    }

    public async getUser (
            authToken: AuthToken,
            alias: string
        ): Promise<User | null> {
            return this.userService.getUser(authToken, alias)
        };

    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}