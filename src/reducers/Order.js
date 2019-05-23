import { handleActions } from "redux-actions";
import { orderActions } from "../actions";

const initialState = {
  orderId: {},
  orderData: {
    orders: [],
    isLoading: true
  },
  orderStatus: [],
  isLoading: true
};

export const orderReducer = handleActions(
  {
    [orderActions.GET_ORDER_ID_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [orderActions.GET_ORDER_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      orderData: {
        isLoading: false,
        orders: payload.data
      },
      orderStatus: payload.orderStatus
    })
  },
  initialState
);
