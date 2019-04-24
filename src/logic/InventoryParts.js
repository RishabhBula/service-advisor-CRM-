import { createLogic } from "redux-logic";
import {
  inventoryPartsActions,
  modelOpenRequest,
  showLoader,
  hideLoader,
  getInventoryPartsListStarted,
  getInventoryPartsListSuccess,
  getInventoryPartsList
} from "./../actions";
import { logger } from "../helpers/Logger";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
import { AppConfig } from "../config/AppConfig";
let lastReq;
const getInventoryPartsVendorLogic = createLogic({
  type: inventoryPartsActions.GET_VENDORS_LIST,
  async process({ action, getState }, dispatch, done) {
    if (lastReq) {
      lastReq.cancelRequest();
    }
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

const addPartToInventoryLogic = createLogic({
  type: inventoryPartsActions.ADD_PART_TO_INVENTORY,
  async process({ action, getState }, dispatch, done) {
    const { data, query } = action.payload;
    dispatch(showLoader());
    const api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inventory",
      "/part",
      "POST",
      true,
      undefined,
      data
    );
    logger(result);
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(hideLoader());
      done();
      return;
    }
    toast.success(result.messages[0]);
    dispatch(
      modelOpenRequest({
        modelDetails: {
          partAddModalOpen: false
        }
      })
    );
    dispatch(hideLoader());
    dispatch(
      getInventoryPartsList({
        ...query
      })
    );
    done();
  }
});

const getInventoryPartsListLogic = createLogic({
  type: inventoryPartsActions.GET_PARTS_LIST,
  async process({ action, getState }, dispatch, done) {
    dispatch(getInventoryPartsListStarted());
    const api = new ApiHelper();
    let result = await api.FetchFromServer("/inventory", "/part", "GET", true, {
      ...action.payload,
      limit: AppConfig.ITEMS_PER_PAGE
    });
    if (result.isError) {
      dispatch(
        getInventoryPartsListSuccess({
          parts: [],
          total: 0
        })
      );
      done();
      return;
    }
    dispatch(getInventoryPartsListSuccess(result.data));
    done();
  }
});

export const InventoryPartsLogic = [
  getInventoryPartsVendorLogic,
  addPartToInventoryLogic,
  getInventoryPartsListLogic
];
