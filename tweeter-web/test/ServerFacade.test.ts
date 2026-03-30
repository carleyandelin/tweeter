import "isomorphic-fetch";
import { ServerFacade } from "../src/network/ServerFacade";
import {
  RegisterRequest,
  LoginRequest,
  PagedUserItemRequest,
  GetCountRequest,
} from "tweeter-shared";
import { AuthToken, User } from "tweeter-shared";

// ─────────────────────────────────────────────
// Shared test state
// ─────────────────────────────────────────────
const facade = new ServerFacade();

let registeredUser: User;
let registeredAuthToken: AuthToken;

// ─────────────────────────────────────────────
// Register
// ─────────────────────────────────────────────
describe("ServerFacade - Register", () => {
  it("returns a valid User and AuthToken on successful registration", async () => {
    const request = new RegisterRequest(
      "Allen",
      "Anderson",
      "@allen",
      "password",
      "", // imageStringBase64 – empty for FakeData
      "png"
    );

    const [user, authToken] = await facade.register(request);

    // FakeData always returns the first user (Allen Anderson)
    expect(user).not.toBeNull();
    expect(user.firstName).toBe("Allen");
    expect(user.lastName).toBe("Anderson");
    expect(authToken).not.toBeNull();
    expect(authToken.token).toBeTruthy();

    registeredUser = user;
    registeredAuthToken = authToken;
  });
});

// ─────────────────────────────────────────────
// GetFollowers
// ─────────────────────────────────────────────
describe("ServerFacade - GetFollowers", () => {
  it("returns a non-empty list of followers and a hasMore flag", async () => {
    // Use the registered user/token from above; fall back to stub values
    // if tests are run in isolation
    const authToken = registeredAuthToken ?? AuthToken.fromDto({ token: "stub", timestamp: Date.now() })!;
    const user = registeredUser ?? User.fromDto({ firstName: "Allen", lastName: "Anderson", alias: "@allen", imageUrl: "" })!;

    const request = new PagedUserItemRequest(
      authToken.dto,
      user.alias,
      10,
      null
    );

    const [followers, hasMore] = await facade.getMoreFollowers(request);

    expect(Array.isArray(followers)).toBe(true);
    expect(followers.length).toBeGreaterThan(0);
    expect(followers[0]).toBeInstanceOf(User);
    expect(typeof hasMore).toBe("boolean");
  });
});

// ─────────────────────────────────────────────
// GetFollowerCount and GetFolloweeCount
// ─────────────────────────────────────────────
describe("ServerFacade - GetFollowerCount and GetFolloweeCount", () => {
  it("returns a follower count greater than zero", async () => {
    const authToken = registeredAuthToken ?? AuthToken.fromDto({ token: "stub", timestamp: Date.now() })!;
    const user = registeredUser ?? User.fromDto({ firstName: "Allen", lastName: "Anderson", alias: "@allen", imageUrl: "" })!;

    const request = new GetCountRequest(authToken.dto, user.dto);
    const count = await facade.getFollowerCount(request);

    expect(count).toBeGreaterThan(0);
  });

  it("returns a followee count greater than zero", async () => {
    const authToken = registeredAuthToken ?? AuthToken.fromDto({ token: "stub", timestamp: Date.now() })!;
    const user = registeredUser ?? User.fromDto({ firstName: "Allen", lastName: "Anderson", alias: "@allen", imageUrl: "" })!;

    const request = new GetCountRequest(authToken.dto, user.dto);
    const count = await facade.getFolloweeCount(request);

    expect(count).toBeGreaterThan(0);
  });
});
