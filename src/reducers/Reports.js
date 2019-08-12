import { handleActions } from "redux-actions";
import { ReportActions } from "../actions";

const initialState = {
  customerReport: {
    data: [],
    isLoading: true
  }
};
/**
 *
 */
export const reportReducer = handleActions(
  {
    [ReportActions.UPDATE_CUSTOMER_INVOICE_REPORTS]: (state, action) => ({
      ...state,
      customerReport: action.payload
    })
  },
  initialState
);
