import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";
import { Service } from "../model.service/Service";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
    addItems: (items: T[]) => void
}

export abstract class PagedItemPresenter<T, U extends Service> extends Presenter<PagedItemView<T>> {
    private userService = new UserService();
    private _hasMoreItems = true;
    private _lastItem: T | null = null;
    private _service: U;

    constructor(view: PagedItemView<T>) {
        super(view);
        this._service = this.serviceFactory();
    }

    protected get lastItem() { return this._lastItem; }
    public get hasMoreItems() { return this._hasMoreItems; }
    protected get service() { return this._service; }

    protected set lastItem(value: T | null) { this._lastItem = value; }
    protected set hasMoreItems(value: boolean) { this._hasMoreItems = value; }
    
    protected abstract itemDescription(): string;
    protected abstract serviceFactory(): U;

    reset() {
      this._lastItem = null;
      this._hasMoreItems = true;
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.userService.getUser(authToken, alias)
    };

    protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        this.doFailureReportingOperation(async () => {
            const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);
            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        }, this.itemDescription())
    };
}