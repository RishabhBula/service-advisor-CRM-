import { createLogic } from "redux-logic";
import { inventoryPartsActions } from "./../actions";
import { logger } from "../helpers/Logger";
import { ApiHelper } from "../helpers/ApiHelper";
let lastReq;
const getInventoryPartsVendorLogic = createLogic({
  type: inventoryPartsActions.GET_VENDORS_LIST,
  async process({ action, getState }, dispatch, done) {
    // if (lastReq) {
    //   lastReq.cancel
    // }
    lastReq = new ApiHelper();
    let result = await lastReq.FetchFromServer(
      "/vendor",
      "/vendorList",
      "GET",
      true,
      { search: action.payload.input }
    );
    logger(result);
    if (result.isError) {
      done();
      return;
    }
    const options = result.data.data.map(vendor => ({
      label: vendor.name,
      value: vendor._id
    }));
    action.payload.callback(options);
    done();
  }
});

export const InventoryPartsLogic = [getInventoryPartsVendorLogic];
