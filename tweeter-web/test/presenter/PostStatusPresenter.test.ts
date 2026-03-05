import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter"
import { AuthToken } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
    let mockPostStatusPresenterView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockService: StatusService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockPostStatusPresenterView = mock<PostStatusView>();
        const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);
        when(mockPostStatusPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123")

        const PostStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusPresenterViewInstance));
        postStatusPresenter = instance(PostStatusPresenterSpy);

        mockService = mock<StatusService>();
        when(PostStatusPresenterSpy.service).thenReturn(instance(mockService));
    })

    // one
    it("tells the view to display a posting status message", async () => {
        const mockEvent = { preventDefault: jest.fn() } as unknown as React.MouseEvent;
        await postStatusPresenter.submitPost(mockEvent, "this is my post", anything(), authToken)
        verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once()
    })
    
    // two
    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        const mockEvent = { preventDefault: jest.fn() } as unknown as React.MouseEvent;
        await postStatusPresenter.submitPost(mockEvent, "this is my post", anything(), authToken)
        const [capturedAuthToken, capturedStatus] = capture(mockService.postStatus).byCallIndex(0)
        expect(capturedAuthToken).toEqual(authToken)
        expect(capturedStatus.post).toEqual("this is my post")
        verify(mockService.postStatus(authToken, capturedStatus)).once()
    })

    // three
    it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
        const mockEvent = { preventDefault: jest.fn() } as unknown as React.MouseEvent;
        await postStatusPresenter.submitPost(mockEvent, "this is my post", anything(), authToken)
        verify(mockPostStatusPresenterView.deleteMessage(anything())).once()
        verify(mockPostStatusPresenterView.setPost(""))
        verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();
    })

    // four
    it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
        const mockEvent = { preventDefault: jest.fn() } as unknown as React.MouseEvent;
        let error = new Error("any ol' error");
        when(mockService.postStatus(authToken, anything())).thenThrow(error);
        await postStatusPresenter.submitPost(mockEvent, "this is my post", anything(), authToken);

        verify(mockPostStatusPresenterView.displayErrorMessage("Failed to post the status because of exception: any ol' error"))
        verify(mockPostStatusPresenterView.setPost("")).never()
        verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).never();

    })

})