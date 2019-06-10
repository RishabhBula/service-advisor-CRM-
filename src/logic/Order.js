import { createLogic } from "redux-logic";

import { ApiHelper } from "../helpers/ApiHelper";

import {
  getOrderIdFailed,
  getOrderIdSuccess,
  orderActions,
  showLoader,
  hideLoader,
  redirectTo,
  getOrderListSuccess,
  addOrderSuccess,
  modelOpenRequest,
  updateOrderDetailsSuccess,
  getServiceListSuccess,
  getOrderDetailsSuccess,
  getInspectionListSuccess,
} from "./../actions";
import { logger } from "../helpers/Logger";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
import { AppRoutes } from "../config/AppRoutes";
import { reorderArray } from "../helpers/Array";

/**
 *
 */
const getOrderId = createLogic({
  type: orderActions.GET_ORDER_ID_REQUEST,
  async process({ action }, dispatch, done) {
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/order",
      "/orderId",
      "GET",
      true,
      undefined
    );
    logger(result);
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(
        getOrderIdFailed({
          orderId: {},
          isLoading: false
        })
      );
    } else {
      dispatch(
        getOrderIdSuccess({
          orderId: result.data.orderId,
          isLoading: false
        })
      );
    }
    done();
  }
});

/**
 *
 */
const getOrdersLogic = createLogic({
  type: orderActions.GET_ORDER_LIST_REQUEST,
  async process({ action }, dispatch, done) {
    let api = new ApiHelper();
    let result = await api.FetchFromServer("/order", "/getOrders", "GET", true);

    if (!result.isError) {
      dispatch(getOrderListSuccess(result.data));
    }
    done();
  }
});

/**
 *
 */

const updateOrderWorkflowStatusLogic = createLogic({
  type: orderActions.REQUEST_ORDER_STATUS_UPDATE,
  async process({ action, getState }, dispatch, done) {
    const { orderReducer } = getState();
    const { orderData, orderStatus } = orderReducer;
    let { orders } = orderData;
    const { orderId, from, to, destinationIndex, sourceIndex } = action.payload;
    if (!orders[to]) {
      orders[to] = [];
    }
    orders[to].push(orders[from][sourceIndex]);
    orders[from].splice(sourceIndex, 1);
    dispatch(getOrderListSuccess({ data: orders, orderStatus }));
    new ApiHelper().FetchFromServer(
      "/order",
      "/updateOrderStatus",
      "POST",
      true,
      undefined,
      {
        orderId,
        orderStatus: to,
        orderIndex: destinationIndex
      }
    );

    done();
  }
});

/**
 *
 */
const addOrderStatusLogic = createLogic({
  type: orderActions.ADD_ORDER_STATUS,
  async process({ action, getState }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/order",
      "/addOrderStatus",
      "POST",
      true,
      undefined,
      action.payload
    );
    const { orderData, orderStatus } = getState().orderReducer;
    const { orders } = orderData;
    orders[result.data.orderStatus._id] = [];
    orderStatus.push(result.data.orderStatus);
    logger(result);
    dispatch(getOrderListSuccess({ data: orders, orderStatus }));
    dispatch(
      modelOpenRequest({
        modelDetails: {
          addOrderStatusModalOpen: false
        }
      })
    );
    dispatch(hideLoader());
    done();
  }
});

/**
 *
 */
const deleteOrderStatusLogic = createLogic({
  type: orderActions.DELTE_ORDER_STATUS,
  async process({ action, getState }, dispatch, done) {
    let api = new ApiHelper();
    dispatch(showLoader());
    await api.FetchFromServer(
      "/order",
      "/deleteOrderStatus",
      "DELETE",
      true,
      undefined,
      action.payload
    );
    const { statusId, newStatusId } = action.payload;
    const { orderStatus, orderData } = getState().orderReducer;
    const { orders } = orderData;
    const ind = orderStatus.findIndex(d => d._id === statusId);
    orderStatus.splice(ind, 1);
    if (!orders[newStatusId]) {
      orders[newStatusId] = [];
    }
    if (!orders[statusId]) {
      orders[statusId] = [];
    }
    orders[newStatusId] = [...orders[statusId], ...orders[newStatusId]];
    dispatch(getOrderListSuccess({ data: orders, orderStatus }));
    dispatch(hideLoader());
    done();
  }
});

/**
 *
 */
const updateOrderOfOrderStatusLogic = createLogic({
  type: orderActions.UPDATE_ORDER_OF_ORDER_STATUS,
  async process({ action, getState }, dispatch, done) {
    const { payload } = action;
    const { from, to } = payload;
    const { orderStatus: oldOrderStatus, orderData } = getState().orderReducer;
    const { orders: data } = orderData;

    const orderStatus = reorderArray(oldOrderStatus, from.index, to.index);
    logger(orderStatus);
    dispatch(getOrderListSuccess({ data, orderStatus }));
    await new ApiHelper().FetchFromServer(
      "/order",
      "/updateOrderOfOrderStatus",
      "PUT",
      true,
      undefined,
      orderStatus
    );

    done();
  }
});
/**
 *
 */
const addOrderLogic = createLogic({
  type: orderActions.ADD_ORDER_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/order",
      "/addOrder",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      dispatch(
        addOrderSuccess({
          result: result.data.result
        })
      );
      dispatch(
        redirectTo({
          path: `${AppRoutes.WORKFLOW_ORDER.url.replace(
            ":id",
            `${result.data.result._id}`
          )}`
        })
      );
      done();
    }
  }
});
/**
 *
 */
const updateOrderDetailsLogic = createLogic({
  type: orderActions.UPDATE_ORDER_DETAILS,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/order",
      "/updateOrderDetails",
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(updateOrderDetailsSuccess());
      dispatch(hideLoader());
      done();
    }
  }
});
const deleteOrderLogic = createLogic({
  type: orderActions.DELETE_ORDER_REQUEST,
  async process({ action, getState }, dispatch, done) {
    const { payload } = action;
    const { id, index, statusId } = payload;
    logger(id, index);
    const { orderReducer } = getState();
    const { orderData, orderStatus } = orderReducer;
    const { orders } = orderData;

    orders[statusId].splice(index, 1);
    let api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/order",
      "/deleteOrder",
      "DELETE",
      true,
      undefined,
      { id }
    );
    let toastType = "error";
    if (!result.isError) {
      toastType = "success";
      dispatch(getOrderListSuccess({ data: orders, orderStatus }));
    }
    toast[toastType](result.messages[0]);
    done();
  }
});
/**
 *
 */
const getOrderDetails = createLogic({
  type: orderActions.GET_ORDER_DETAILS_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/order",
      "/orderDetails",
      "GET",
      true,
      {
        search:
          action.payload && action.payload.input
            ? action.payload.input
            : action.payload && action.payload.search
              ? action.payload.search
              : null,
        _id: action.payload && action.payload._id ? action.payload._id : null
      },
      undefined
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      dispatch(
        getServiceListSuccess({
          services: result.data.serviceResult,
          customerCommentData: result.data.customerCommentData
        })
      );
      dispatch(getInspectionListSuccess(
        {
          inspection: result.data.inspectionResult
        }
      ))
      dispatch(
        getOrderDetailsSuccess({
          order: result.data.data[0],
          orderId: result.data.data[0].orderId
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

export const OrderLogic = [
  getOrderId,
  getOrdersLogic,
  deleteOrderStatusLogic,
  addOrderStatusLogic,
  updateOrderWorkflowStatusLogic,
  updateOrderOfOrderStatusLogic,
  addOrderLogic,
  updateOrderDetailsLogic,
  getOrderDetails,
  deleteOrderLogic
];
