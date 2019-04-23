import { handleActions } from "redux-actions";
import { vendorActions } from "../actions"

const initialState = {
  vendors:[],
  totalVendors: 100,
  vendorData:{
    isSuccess: false,
    data: {}
  }
}

export const vendorsReducer = handleActions(
  {
    [vendorActions.GET_VENDOR_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload
    }),

  },
  initialState
)