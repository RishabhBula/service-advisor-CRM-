import { createAction } from "redux-actions";

export const customersAddActions = {
  CUSTOMER_ADD_REQUEST: "Customer Add requested!",
  CUSTOMER_ADD_SUCCESS: "Customer Add successfully!",
  CUSTOMER_ADD_FAILED: "Customer Add failed!",
  CUSTOMER_ADD_START: "Customer Add Started!",
  CUSTOMER_GET_REQUEST: "Customer Get Requested!",
  CUSTOMER_GET_START: "Customer get Started!",
  CUSTOMER_GET_SUCCESS: "Customer Get successfully!",
  CUSTOMER_GET_FAILED: "Customer Get failed!",
  DELETE_CUSTOMER: "Delete customer Requested!",
  UPDATE_CUSTOMER_STATUS: "Update customer status Requested!",
  EDIT_CUSTOMER_REQUESTED: "Edit CUSTOMER Requested!",
  EDIT_CUSTOMER_SUCCESS: "Edit CUSTOMER Success!"
};

export const customerAddRequest = createAction(
  customersAddActions.CUSTOMER_ADD_REQUEST
);
export const customerAddStarted = createAction(
  customersAddActions.CUSTOMER_ADD_START
);
export const customerAddSuccess = createAction(
  customersAddActions.CUSTOMER_ADD_SUCCESS
);
export const customerAddFailed = createAction(
  customersAddActions.CUSTOMER_ADD_FAILED
);

export const customerGetRequest = createAction(
  customersAddActions.CUSTOMER_GET_REQUEST
);
export const customerGetStarted = createAction(
  customersAddActions.CUSTOMER_GET_START
);
export const customerGetSuccess = createAction(
  customersAddActions.CUSTOMER_GET_SUCCESS
);
export const customerGetFailed = createAction(
  customersAddActions.CUSTOMER_GET_FAILED
);

export const deleteCustomer = createAction(customersAddActions.DELETE_CUSTOMER);

export const updateCustomerStatus = createAction(
  customersAddActions.UPDATE_CUSTOMER_STATUS
);

export const customerEditRequest = createAction(
  customersAddActions.EDIT_CUSTOMER_REQUESTED
);
export const customerEditSuccess = createAction(
  customersAddActions.EDIT_CUSTOMER_SUCCESS
);
