

export interface View {
    displayErrorMessage: (message: string) => void
}

// used generic types because we need more than one datatype
export abstract class Presenter<V extends View> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view;
    }

    protected get view() {
        return this._view;
    }

    protected async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string) {
        try {
            await operation()
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to ${operationDescription} because of exception: ${error}`
            );
        }
    };

}