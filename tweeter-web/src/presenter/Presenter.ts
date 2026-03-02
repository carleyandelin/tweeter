

export interface View {
    displayErrorMessage: (message: string) => void
}

export interface MessageView extends View {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
    deleteMessage: (message: string) => void
}

// used generic types because we need more than data type
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

/* below is the base of the doFailureReportingOperation to put in each method

this.doFailureReportingOperation(async () => {
    FUNCTION
}, "")
// finally block goes here  if there is one

*/