import { createAction } from "redux-actions";

export const orderActions = {
    GET_ORDER_LIST_REQUEST: "Order list Requested!",
    GET_ORDER_LIST_SUCCESS: "Order list success!",
    GET_ORDER_LIST_FAILED: 'Order list failed!',
    ADD_ORDER_REQUEST: "Order add request!",
    ADD_ORDER_FAILED: "Order add failed",
    ADD_ORDER_SUCCESS: "Order add success!",
    UPDATE_ORDER_REQUEST: "Order update request!",
    UPDATE_ORDER_SUCCESS: "Order update success!",
    DELETE_ORDER_REQUEST: "Order delete request!",
    DELETE_ORDER_SUCCESS: "Order delete success!",
    GET_ORDER_ID_REQUEST: "Order id Requested",
    GET_ORDER_ID_SUCCESS: "Order id Ssccess!",
    GET_ORDER_ID_FAILED: "Order id Failed!",
};

export const getOrderList = createAction(orderActions.GET_ORDER_LIST_REQUEST);
export const getOrderListSuccess = createAction(
    orderActions.GET_ORDER_LIST_SUCCESS
);
export const getOrderListFail = createAction(
    orderActions.GET_ORDER_LIST_FAILED
);
export const addOrderRequest = createAction(orderActions.ADD_ORDER_REQUEST);
export const addOrderSuccess = createAction(orderActions.ADD_ORDER_SUCCESS);
export const addOrderFailed = createAction(orderActions.ADD_ORDER_FAILED);
export const updateOrderRequest = createAction(orderActions.UPDATE_ORDER_REQUEST);
export const updateOrderSuccess = createAction(orderActions.UPDATE_ORDER_SUCCESS);
export const deleteOrderRequest = createAction(orderActions.DELETE_ORDER_REQUEST);
export const deleteOrderSuccess = createAction(orderActions.DELETE_ORDER_SUCCESS);
export const getOrderIdRequest = createAction(orderActions.GET_ORDER_ID_REQUEST);
export const getOrderIdSuccess = createAction(orderActions.GET_ORDER_ID_SUCCESS);
export const getOrderIdFailed = createAction(orderActions.GET_ORDER_ID_FAILED);