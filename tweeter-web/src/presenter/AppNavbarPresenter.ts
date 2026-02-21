

export interface AppNavbarView {}

export class AppNavbarPresenter {
    _view: AppNavbarView
    
    public constructor(view: AppNavbarView) {
        this._view = view;
    }
}