import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { AppConfig } from "../config/AppConfig";

import { 
  addVendorSuccess,
  editVendorSuccess,
  getVendorsList,
  getVendorsListSuccess,
  showLoader,
  hideLoader,
  modelOpenRequest,
  vendorActions,
  deleteVendorSuccess
} from "../actions"


const getVendorLogic = createLogic({
  type: vendorActions.GET_VENDOR_LIST,
  async process({ action }, dispatch, done) {
    dispatch(
      getVendorsListSuccess({
        isLoading: true,
        vendors: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vendor",
       "/vendorList",
        "GET",
       true, {
      ...action.payload,
      limit: AppConfig.ITEMS_PER_PAGE
    });
    if (result.isError) {
      dispatch(
        getVendorsListSuccess({
          isLoading: false,
          vendors: []
        })
      );
      done();
      return;
    } else {
      dispatch(hideLoader());
      dispatch(
        getVendorsListSuccess({
          isLoading: false,
          vendors: result.data.data,
          totalVendors: result.data.totalVendor
        })
      );
      done();
    }
  }
});

const addVendorsLogic = createLogic({
  type: vendorActions.ADD_VENDOR,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vendor",
      "/addVendor",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(
        modelOpenRequest({
          modelDetails: {
            vendorAddModalOpen: false
          }
        })
      );
      dispatch(addVendorSuccess());
      dispatch(hideLoader());
      done();
    }
  }
});

const editVendorsLogic = createLogic({
  type: vendorActions.EDIT_VENDOR,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vendor",
      "/updateVendor",
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(
        modelOpenRequest({
          modelDetails: {
            vendorEditModalOpen: false
          }
        })
      );
      dispatch(editVendorSuccess());
      dispatch(
        getVendorsList({
          ...action.payload
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

const deleteVendorLogic = createLogic({
  type: vendorActions.DELETE_VENDOR,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vendor",
      "/delete",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(deleteVendorSuccess());
      dispatch(
        getVendorsList({
          ...action.payload
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

export const VendorLogic = [
  addVendorsLogic,
  getVendorLogic,
  editVendorsLogic,
  deleteVendorLogic
];
