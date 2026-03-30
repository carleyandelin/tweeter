import { RegisterRequest, RegisterResponse } from "tweeter-shared";

export class ServerFacade {
  private SERVER_URL = "https://255wg6d684.execute-api.us-west-2.amazonaws.com/dev";

  public async register(request: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${this.SERVER_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });

    const data = await response.json();

    // parse the body from API Gateway
    const parsed: RegisterResponse = JSON.parse(data.body);

    return parsed;
  }
}
