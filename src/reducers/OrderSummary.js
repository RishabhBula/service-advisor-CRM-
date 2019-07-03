import { handleActions } from "redux-actions";
import { SummaryActions } from "../actions";

const initialState = {
  isSuccess: false,
  orderData: [],
  companyData: [],
  messageData:[],
  isLoading: true,
}

export const summaryReducer = handleActions(
  {
    [SummaryActions.GET_ORDER_SUMMARY]: (state, action) => ({
      orderData: action.payload.order,
      companyData: action.payload.user,
      messageData: action.payload.message,
      isSuccess: true,
      isLoading:false
    }),
    
  },
  initialState
);