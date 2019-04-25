import { createLogic } from "redux-logic";
import { inventoryStatsAction } from "../actions";
import { ApiHelper, logger } from "../helpers";

const getInventoryStatsLogic = createLogic({
  type: inventoryStatsAction.GET_INVENTORY_STATS,
  async process({ action }, dispatch, done) {
    const Api = new ApiHelper();
    const result = await Api.FetchFromServer(
      "/inventoryStat",
      "/",
      "GET",
      true
    );
    logger(result);
    done();
  }
});

export const InventoryStatsLogic = [getInventoryStatsLogic];
