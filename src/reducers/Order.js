import { handleActions } from "redux-actions";
import { orderActions } from "../actions";

const initialState = {
   orderId: {},
   isLoading: true
};

export const orderReducer = handleActions(
   {
      [orderActions.GET_ORDER_ID_SUCCESS]: (state, { payload }) => ({
         ...state,
         ...payload,
      })
   },
   initialState
);
