import { createAction } from "redux-actions";

export const vendorActions = {
  ADD_VENDOR: "Add new vendor Requested!",
  ADD_VENDOR_SUCCESS: "Add new vendor Success!",
  GET_VENDOR_LIST: "User list Requested!",
  GET_VENDOR_LIST_SUCCESS: "Vendor list success!",
}

export const getVendorsList = createAction(vendorActions.GET_VENDOR_LIST);
export const getVendorsListSuccess = createAction(
  vendorActions.GET_VENDOR_LIST_SUCCESS
);
export const addNewVendor = createAction(vendorActions.ADD_VENDOR);
export const addVendorSuccess = createAction(vendorActions.ADD_VENDOR_SUCCESS);