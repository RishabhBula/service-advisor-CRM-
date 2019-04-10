import { createAction } from "redux-actions";

export const customersAddActions = {
         CUSTOMER_ADD_REQUEST: "Customer Add requested!",
         CUSTOMER_ADD_SUCCESS: "Customer Add successfully!",
         CUSTOMER_ADD_FAILED: "Customer Add failed!",
         CUSTOMER_ADD_START: "Customer Add Started!"
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


