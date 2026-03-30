import "isomorphic-fetch";
import { StatusService } from "../src/model.service/StatusService";
import { AuthToken, User, Status } from "tweeter-shared";

// ─────────────────────────────────────────────
// StatusService – Story integration test
// ─────────────────────────────────────────────
describe("StatusService - loadMoreStoryItems", () => {
  it("returns a non-empty list of story statuses and a hasMore flag", async () => {
    const service = new StatusService();

    // Use a stub AuthToken and User – FakeData ignores them
    const authToken = AuthToken.fromDto({ token: "stub-token", timestamp: Date.now() })!;
    const user = User.fromDto({
      firstName: "Allen",
      lastName: "Anderson",
      alias: "@allen",
      imageUrl: "",
    })!;

    const [statuses, hasMore] = await service.loadMoreStoryItems(
      authToken,
      user.alias,
      10,
      null
    );

    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses[0]).toBeInstanceOf(Status);
    expect(statuses[0].post).toBeTruthy();
    expect(typeof hasMore).toBe("boolean");
  });
});
