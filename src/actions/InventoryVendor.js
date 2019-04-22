import { createAction } from "redux-actions";

export const vendorActions = {
  ADD_VENDOR: "Add new vendor Requested!",
  ADD_VENDOR_SUCCESS: "Add new vendor Success!",
}

export const addNewVendor = createAction(vendorActions.ADD_VENDOR);
export const addVendorSuccess = createAction(vendorActions.ADD_VENDOR_SUCCESS);