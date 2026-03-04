import { anything, instance, mock, verify } from "@typestrong/ts-mockito";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter"
import { AuthToken } from "tweeter-shared";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarPresenterView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavbarPresenterView = mock<AppNavbarView>();
        const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

        appNavbarPresenter = new AppNavbarPresenter(mockAppNavbarPresenterViewInstance);
    })

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.displayInfoMessage(anything(), 0)).once();
    })

    // it("calls logout on the user service with the correct auth token", () => {})

    // it("", () => {})

    // it("", () => {})

})