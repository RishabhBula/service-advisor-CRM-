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
  customerOrders: [],
  vehicleOrders: [],
  data: [],
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
      ...payload
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
      isLoading: true
    }),
    [orderActions.UPDATE_ORDER_DETAILS_SUCCESS]: (state, { payload }) => ({
      ...state,
      isLoading: false
    }),
    [orderActions.GET_ORDER_DETAILS_REQUEST]: (state, { payload }) => ({
      ...state,
      isOrderLoading: true
    }),
    [orderActions.GET_ORDER_DETAILS_SUCCESS]: (state, { payload }) => ({
      ...state,
      orderItems: payload.order,
      orderId: payload.orderId,
      customerOrders: payload.customerOrders,
      vehicleOrders: payload.vehicleOrders,
      isOrderLoading: false
    })
  },
  initialState
);
