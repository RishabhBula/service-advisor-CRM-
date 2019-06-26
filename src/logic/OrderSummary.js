import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  SummaryActions,
  getOrderDetailsSuccess,
  showLoader,
  hideLoader,
  redirectTo
} from "./../actions";
import { DefaultErrorMessage } from "../config/Constants";

const verifyLinkLogic = createLogic({
  type: SummaryActions.VERIFY_LINK_REQUEST,
  async process({ action }, dispatch, done) {
    localStorage.removeItem("userId");
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/message",
      "/verifyLink",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(hideLoader());
      dispatch(
        redirectTo({
          path: "/404"
        })
      );
      done();
      return;
    } else {
      dispatch(hideLoader());
      dispatch(
        getOrderDetailsSuccess({
          order: result.data.data,
          orderId: result.data.data.orderId
        })
      );
      done();
    }
  }
});

export const OrderSummaryLogic = [
  verifyLinkLogic,
];
