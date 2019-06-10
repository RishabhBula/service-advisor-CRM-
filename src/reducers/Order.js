import { handleActions } from "redux-actions";
import { orderActions } from "../actions";

const initialState = {
  orderId: {},
  orderData: {
    orders: [],
    isLoading: true
  },
  orderStatus: [],
  orderItems: [],
  isOrderLoading: true
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
    }),
    [orderActions.ADD_ORDER_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload,
      orderItems: payload.result
    }),
    [orderActions.GET_ORDER_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      orderData: {
        isLoading: false,
        orders: payload.data
      },
      orderStatus: payload.orderStatus
    }),
    [orderActions.UPDATE_ORDER_DETAILS]: (state, { payload }) => ({
      ...state,
      ...payload,
      isLoading: true
    }),
    [orderActions.UPDATE_ORDER_DETAILS_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload,
      isLoading: false
    }),
    [orderActions.GET_ORDER_DETAILS_REQUEST]: (state, { payload }) => ({
      ...state,
      ...payload,
      isOrderLoading: true
    }),
    [orderActions.GET_ORDER_DETAILS_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload,
      orderItems: payload.order,
      orderId: payload.orderId,
      isOrderLoading: false
    }),
  },
  initialState
);
