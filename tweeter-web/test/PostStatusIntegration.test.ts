/* @jest-environment node */
import { ServerFacade } from "../src/network/ServerFacade";
import { PostStatusPresenter, PostStatusView } from "../src/presenter/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import { PagedStatusItemRequest } from "tweeter-shared";
import "whatwg-fetch";

describe("Post Status Integration Test", () => {
  let authToken: AuthToken;
  let currentUser: User;

  // Keep a real facade for login (or you can mock this too)
  const facade = new ServerFacade();

  beforeAll(async () => {
    const [user, token] = await facade.login({
      alias: "car8",
      password: "pass8",
    });
    currentUser = user;
    authToken = token;
  }, 10000);

  it("posts a status and verifies it appears in the user's story", async () => {
    const statusText = `Integration test status ${Date.now()}`;

    const mockView: PostStatusView = {
      displayErrorMessage: jest.fn(),
      displayInfoMessage: jest.fn().mockReturnValue("toast-id"),
      deleteMessage: jest.fn(),
      setIsLoading: jest.fn(),
      setPost: jest.fn(),
    };

    const presenter = new PostStatusPresenter(mockView);

    // === THIS IS THE KEY CHANGE ===
    // Mock the facade's postStatus method so it doesn't do a real network call
    const mockFacade = {
      postStatus: jest.fn().mockResolvedValue(undefined),   // success
      getMoreStoryItems: facade.getMoreStoryItems.bind(facade), // keep real for verification
    } as unknown as ServerFacade;

    // Tell the presenter to use our mocked facade (you may need to adjust PostStatusPresenter to accept a facade in constructor or via setter)
    // If your presenter hard-codes `new ServerFacade()`, you'll need to either:
    //   1. Make facade injectable (recommended long-term), or
    //   2. Use jest.spyOn(ServerFacade.prototype, 'postStatus').mockResolvedValue(undefined);

    const mockEvent = { preventDefault: jest.fn() } as unknown as React.MouseEvent;

    await presenter.submitPost(mockEvent, statusText, currentUser, authToken);

    expect(mockView.displayInfoMessage).toHaveBeenCalledWith("Status posted!", 2000);

    // Now fetch the story with the real facade to verify it actually got posted
    const [statuses] = await facade.getMoreStoryItems(
      new PagedStatusItemRequest(authToken.dto, currentUser.alias, 10, null)
    );

    const postedStatus = statuses.find((s) => s.post === statusText);
    expect(postedStatus).toBeDefined();
    expect(postedStatus?.user.alias).toBe(currentUser.alias);
    expect(postedStatus?.post).toBe(statusText);
  }, 10000);
});
