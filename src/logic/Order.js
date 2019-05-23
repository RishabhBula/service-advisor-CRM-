import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  getOrderIdFailed,
  getOrderIdSuccess,
  orderActions,
  getOrderListSuccess
} from "./../actions";
import { logger } from "../helpers/Logger";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
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

const updateOrderStatusLogic = createLogic({
  type: orderActions.REQUEST_ORDER_STATUS_UPDATE,
  async process({ action, getState }, dispatch, done) {
    const { orderReducer } = getState();
    const { orderData } = orderReducer;
    logger(action.payload, orderData);
    dispatch(getOrderListSuccess({ ...orderReducer }));
    done();
  }
});

export const OrderLogic = [getOrderId, getOrdersLogic, updateOrderStatusLogic];
