import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import { loginActions, redirectTo, showLoader, hideLoader } from "./../actions";

const loginLogic = createLogic({
  type: loginActions.LOGIN_REQUEST,
  cancelType: loginActions.LOGIN_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/login",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      logger(result);
      localStorage.setItem("token", result.data.token);
      // toast.success(result.messages[0]);
      dispatch(hideLoader());
      dispatch(redirectTo({ path: "/dashboard" }));
      done();
    }
  }
});

const logOutLogic = createLogic({
  type: loginActions.LOGOUT_REQUEST,
  async process({ action }, dispatch, done) {
    localStorage.removeItem("token");
    dispatch(redirectTo({ path: "/login" }));
    done();
  }
});
const forgetPasswordLogic = createLogic({
  type: loginActions.FORGET_PASSWORD_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/forgot-password",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      logger(result);
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      dispatch(redirectTo({ path: "/login" }));
      done();
    }
  }
});
const verifyResetTokenLogic = createLogic({
  type: loginActions.VALIDATE_RESET_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/verify-link",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      dispatch(redirectTo({ path: "/404" }));
      done();
      return;
    } else {
      dispatch(hideLoader());
      done();
    }
  }
});
const resetPasswordLogic = createLogic({
  type: loginActions.RESET_PASSSWORD_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/reset-password",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      dispatch(hideLoader());
      toast.success(result.messages[0]);
      dispatch(redirectTo({ path: "/login" }));
      done();
    }
  }
});
export const LoginLogics = [
  loginLogic,
  logOutLogic,
  forgetPasswordLogic,
  verifyResetTokenLogic,
  resetPasswordLogic
];
