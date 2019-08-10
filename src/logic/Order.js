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
  getOrderDetailsRequest,
  updateOrderDetailsSuccess,
  getServiceListSuccess,
  getOrderDetailsSuccess,
  getInspectionListSuccess,
  getTimeLogsSuccess,
  addNewActivity,
  getActivityList,
  getMessageListSuccess,
  verifyLinkRequest,
  getPaymentSuccess,
  getCannedServiceList
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
let orderListSelectReq;

const getOrdersForSelectLogic = createLogic({
  type: orderActions.GET_ORDER_LIST_FOR_SELECT_REQUEST,
  async process({ action }, dispatch, done) {
    const { payload: req } = action;
    const payload = Object.assign({}, req);
    delete req.callback;
    delete req.input;
    const { customerId, input: search } = payload;
    if (orderListSelectReq) {
      orderListSelectReq.cancelRequest();
    }
    orderListSelectReq = new ApiHelper();
    let result = await orderListSelectReq.FetchFromServer(
      "/order",
      "/getOrders",
      "GET",
      true,
      {
        customerId,
        search
      }
    );
    if (!result.isError) {
      const { data } = result.data;
      const options = [];
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          const element = data[k];
          element.forEach(e => {
            options.push({
              label: `#${e.orderId} - ${e.orderName}`,
              value: e._id,
              data: e
            });
          });
        }
      }
      payload.callback(options);
    }
    logger(result);
    done();
  }
});
/**
 *
 */
let orderListReq;

const getOrdersLogic = createLogic({
  type: orderActions.GET_ORDER_LIST_REQUEST,
  async process({ action }, dispatch, done) {
    const { payload: req } = action;
    const payload = Object.assign({}, req);
    delete payload.callback;
    if (orderListReq) {
      orderListReq.cancelRequest();
    }
    orderListReq = new ApiHelper();
    let result = await orderListReq.FetchFromServer(
      "/order",
      "/getOrders",
      "GET",
      true,
      req
    );
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
    dispatch(getOrderDetailsRequest({ _id: action.payload.orderId }))
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
      {
        customerId:
          action.payload && action.payload.customerId
            ? action.payload.customerId
            : null,
        vehicleId:
          action.payload && action.payload.vehicleId
            ? action.payload.vehicleId
            : null
      }
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
      const data = {
        name: "Created new order",
        type: "NEW_ORDER",
        orderId: result.data.result._id
      };
      dispatch(addNewActivity(data));
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
    if (!action.payload.isChangedOrderStatus) {
      dispatch(showLoader());
    }
    logger(action.aypload);
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
      if (!action.payload.isChangedOrderStatus) {
        dispatch(hideLoader());
      }
      done();
      return;
    } else {
      if (!action.payload.isChangedOrderStatus) {
        toast.success(result.messages[0]);
      }
      if (action.payload.status === true) {
        const data = {
          name: "Order status changed to authorised",
          type: "AUTHORISED_ORDER",
          orderId: action.payload._id
        };
        dispatch(addNewActivity(data));
      }
      if (action.payload.status === false) {
        const data = {
          name: "Order status changed to Unauthorised",
          type: "UNAUTHORISED_ORDER",
          orderId: action.payload._id
        };
        dispatch(addNewActivity(data));
      }
      if (!action.payload.isSummary) {
        dispatch(
          getOrderDetailsRequest({
            _id:
              action.payload && action.payload._id ? action.payload._id : null
          })
        );
      } else {
        dispatch(verifyLinkRequest(action.payload.query));
      }

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
        _id: action.payload && action.payload._id ? action.payload._id : null,
        customerId:
          action.payload && action.payload.customerId
            ? action.payload.customerId
            : null,
        vehicleId:
          action.payload && action.payload.vehicleId
            ? action.payload.vehicleId
            : null,
        technicianId: action.payload && action.payload.technicianId
          ? action.payload.technicianId
          : null
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
      dispatch(
        getActivityList({
          orderId: action.payload._id
        })
      );
      dispatch(
        getInspectionListSuccess({
          inspection: result.data.inspectionResult
        })
      );
      dispatch(
        getTimeLogsSuccess({
          timeLog: result.data.timeClockResult
        })
      );
      dispatch(
        getMessageListSuccess({
          messages: result.data.messageResult
        })
      );
      dispatch(
        getPaymentSuccess({
          payment: result.data.paymentResult
        })
      );
      dispatch(
        getOrderDetailsSuccess({
          order: result.data.data[0],
          orderId: result.data.data[0] ? result.data.data[0].orderId : null,
          customerOrders: !action.payload.vehicleId ? result.data.data : [],
          vehicleOrders: !action.payload.customerId ? result.data.data : []
        })
      );
      dispatch(getCannedServiceList())
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
  deleteOrderLogic,
  getOrdersForSelectLogic
];
