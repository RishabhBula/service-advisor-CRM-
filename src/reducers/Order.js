import { handleActions } from "redux-actions";
import { orderActions } from "../actions";

const initialState = {
   orderId: {},
   orderData: [],
   isLoading: true
};

export const orderReducer = handleActions(
   {
      [orderActions.GET_ORDER_ID_SUCCESS]: (state, { payload }) => ({
         ...state,
         ...payload,
      }),
      [orderActions.ADD_ORDER_REQUEST]: (state, { payload }) => ({
         ...state,
         ...payload,
         orderData: []
      }),
      [orderActions.ADD_ORDER_SUCCESS]: (state, { payload }) => ({
         ...state,
         ...payload,
         orderData: payload.orderData
      }),
   },
   initialState
);
