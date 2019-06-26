import { handleActions } from "redux-actions";
import { SummaryActions } from "../actions";

const initialState = {
  summaryData: {
    isSuccess: false,
    data: []
  },
  isLoading: true,
}

export const summaryReducer = handleActions(
  {
    [SummaryActions.GET_ORDER_SUMMARY]: (state, action) => ({
      ...state,
      summaryData: {
        ...state.data,
        isSuccess: false
      }
    }),
    
  },
  initialState
);