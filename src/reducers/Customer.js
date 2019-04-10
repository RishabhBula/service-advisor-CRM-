import { handleActions } from "redux-actions";
import { customersAddActions } from "./../actions";

const initialAuthState = {
  customerAddInfo: []
};

export const customerInfoReducer = handleActions(
  {
    [customersAddActions.PROFILE_INFO_START]: (state, action) => ({
      ...state,
      customerAddInfo: action.payload.customerAddInfo
    }),
    [customersAddActions.CUSTOMER_ADD_SUCCESS]: (state, action) => ({
      ...state,
      customerAddInfo: action.payload.customerAddInfo
    }),
    [customersAddActions.CUSTOMER_ADD_FAILED]: (state, action) => ({
      ...state,
      customerAddInfo: action.payload.customerAddInfo
    })
  },
  initialAuthState
);
