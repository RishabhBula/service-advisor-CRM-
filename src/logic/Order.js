import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  getOrderIdFailed,
  getOrderIdSuccess,
  orderActions,
  showLoader,
  hideLoader,
  addOrderSuccess,
  redirectTo
} from "./../actions";
import { logger } from "../helpers/Logger";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
import { AppRoutes } from "../config/AppRoutes";

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
      // toast.success(result.messages[0]);
      dispatch(
        redirectTo({
          path: `${AppRoutes.WORKFLOW_ORDER.url.replace(
            ":id",
            `${result.data.result._id}`
          )}`
        })
      );
      dispatch(
        addOrderSuccess({
          orderData: result.data.result
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

export const OrderLogic = [getOrderId, addOrderLogic];
