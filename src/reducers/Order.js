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
