import { MemoryRouter } from "react-router-dom";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthToken, User } from "tweeter-shared";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus"
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import "@testing-library/jest-dom"



jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),

}));

describe("PostStatus component", () => {
    let mockUser: User;
    let mockUserInstance: User;

    let mockAuthToken: AuthToken;
    let mockAuthTokenInstance: AuthToken;

    beforeEach(() => {
        mockUser = mock(User);
        mockUserInstance = instance(mockUser);

        mockAuthToken = mock(AuthToken);
        mockAuthTokenInstance = instance(mockAuthToken);

        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        });
    })

    it("starts with the post status and clear buttons are disabled", () => {
        const {user, postStatusButton, clearButton, postText} = renderPostStatusAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    })

    it("enables both buttons when the text field has text", async () => {
        const {user, postStatusButton, clearButton, postText} = renderPostStatusAndGetElements();
        await user.type(postText, "this is my awesome post")
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    })

    it("disables both buttons when the text field has been cleared", async () => {
        const {user, postStatusButton, clearButton, postText} = renderPostStatusAndGetElements();
        await user.type(postText, "this is my awesome post")
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();

        await user.clear(postText);
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();

    })

    it("calls the presenters postStatus method with correct parameters when the post status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        when(
            mockPresenter.submitPost(anything(), anything(), anything(), anything())
        ).thenResolve();

        const post = "this is my awesome post";
        const {user, postStatusButton, postText} = renderPostStatusAndGetElements(mockPresenterInstance);

        await user.type(postText, post)
        await user.click(postStatusButton);

        verify(mockPresenter.submitPost(anything(), post, mockUserInstance, mockAuthTokenInstance)).once();
    })
});

function renderPostStatus(presenter?: PostStatusPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (<PostStatus presenter={presenter} />) : (<PostStatus />)}
        </MemoryRouter>
    )
}

function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
    const user = userEvent.setup();
    renderPostStatus(presenter);
    const postStatusButton = screen.getByRole("button", { name: /Post Status/i});
    const clearButton = screen.getByRole("button", { name: /Clear/i});
    const postText = screen.getByLabelText("postText");

    return {user, postStatusButton, clearButton, postText};
}