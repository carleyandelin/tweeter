import { StatusService } from "../../service/StatusService";
import { AuthToken, Status } from "tweeter-shared";
import { DynamoDAOFactory } from "../../dao/factory/DynamoDAOFactory";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const service = new StatusService(new DynamoDAOFactory());
    const [statuses, hasMore] = await service.loadMoreFeedItems(
      AuthToken.fromDto(body.authToken)!,
      body.userAlias,
      body.pageSize,
      body.lastItem ? Status.fromDto(body.lastItem) : null
    );
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, items: statuses.map((s) => s.dto), hasMore }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
