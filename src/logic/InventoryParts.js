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
    if (action.payload.page > 1 && !result.data.parts.length) {
      dispatch(
        getInventoryPartsList({
          ...action.payload,
          page: action.payload.page - 1
        })
      );
    } else {
      dispatch(getInventoryPartsListSuccess(result.data));
    }
    done();
  }
});

const deletePartFromInventoryLogic = createLogic({
  type: inventoryPartsActions.DELETE_PART_FROM_INVENTORY,
  async process({ action, getState }, dispatch, done) {
    const { parts, totalParts } = getState().inventoryPartsReducers;
    const { parts: partsToDelete, query } = action.payload;
    dispatch(getInventoryPartsListStarted());
    const api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inventory",
      "/part",
      "DELETE",
      true,
      undefined,
      partsToDelete
    );
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(getInventoryPartsListSuccess({ parts, totalParts }));
      done();
      return;
    }
    toast.success(result.messages[0]);
    dispatch(getInventoryPartsList({ ...query }));
    done();
  }
});

const updatePartToInventoryLogic = createLogic({
  type: inventoryPartsActions.UPDATE_PART_TO_INVENTORY,
  async process({ action, getState }, dispatch, done) {
    const { data, query } = action.payload;
    dispatch(showLoader());
    const api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/inventory",
      "/part",
      "PUT",
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
          partEditModalOpen: false
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
export const InventoryPartsLogic = [
  getInventoryPartsVendorLogic,
  addPartToInventoryLogic,
  getInventoryPartsListLogic,
  deletePartFromInventoryLogic,
  updatePartToInventoryLogic
];
