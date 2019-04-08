import { createAction } from "redux-actions";

export const customersActions = {
  GET_CUSTOMER_LIST: "Customer list Requested!",
  GET_CUSTOMER_LIST_SUCCESS: "User list success!",
  ADD_CUSTOMER: "Add new customer Requested!"
};

export const getCustomerList = createAction(customersActions.GET_CUSTOMER_LIST);
export const getCListSuccess = createAction(
  customersActions.GET_CUSTOMER_LIST_SUCCESS
);
export const addNewCustomer = createAction(customersActions.ADD_CUSTOMER);
