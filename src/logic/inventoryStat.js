import { createLogic } from "redux-logic";
import { inventoryStatsAction } from "../actions";

const getInventoryStatsLogic = createLogic({
  type: inventoryStatsAction.GET_INVENTORY_STATS,
  async process({ action }, dispatch, done) {
    console.log("====================================");
    console.log(action.payload);
    console.log("====================================");
    done();
  }
});

export const InventoryStatsLogic = [getInventoryStatsLogic];
