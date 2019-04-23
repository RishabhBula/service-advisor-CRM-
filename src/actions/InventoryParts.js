import { createAction } from "redux-actions";

export const inventoryPartsActions = {
  GET_VENDORS_LIST: "Get vendors list for part!",
  GET_VENDORS_LIST_SUCCESS: "Get vendors list for part success!"
};

export const getInventoryPartVendors = createAction(
  inventoryPartsActions.GET_VENDORS_LIST
);
export const getInventoryPartVendorsSuccess = createAction(
  inventoryPartsActions.GET_VENDORS_LIST_SUCCESS
);
