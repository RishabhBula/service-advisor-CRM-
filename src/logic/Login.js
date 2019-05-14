import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
  loginActions,
  redirectTo,
  showLoader,
  hideLoader,
  logOutRequest
} from "./../actions";
import { DefaultErrorMessage } from "../config/Constants";
import { APP_URL } from "../config/AppConfig";
import { AppRoutes } from "../config/AppRoutes";
/**
 *
 */
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
    if (result.isError || !result.data.data || !result.data.data.subdomain) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(hideLoader());
      done();
      return;
    } else {
      logger(
        `Redirect URI: ${window.location.protocol}://${
          result.data.data.subdomain
        }.${APP_URL}/verify-user-details?user=${
          result.data.token
        }&key=${Date.now()}&verification=${Math.random()}`
      );
      window.location.href = `${"http"}://${
        result.data.data.subdomain
      }.${APP_URL}/verify-user-details?user=${
        result.data.token
      }&key=${Date.now()}&verification=${Math.random()}`;

      done();
    }
  }
});
/**
 *
 */
const logOutLogic = createLogic({
  type: loginActions.LOGOUT_REQUEST,
  async process({ action }, dispatch, done) {
    localStorage.removeItem("token");
    window.location.href = `http://${APP_URL}`;
    done();
  }
});
/**
 *
 */
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
      toast.error(result.messages[0] || DefaultErrorMessage);
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
/**
 *
 */
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
      toast.error(result.messages[0] || DefaultErrorMessage);
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
/**
 *
 */
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
      toast.error(result.messages[0] || DefaultErrorMessage);
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
/**
 *
 */
const verifyAccountAccessLogic = createLogic({
  type: loginActions.VERIFY_WORKSPACE_LOGIN,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    logger(payload);
    const { user, key, verification } = payload;
    if (!user || !key || !verification) {
      dispatch(logOutRequest());
    }
    localStorage.setItem("token", user);
    const result = await new ApiHelper().FetchFromServer(
      "/user",
      "/getProfile",
      "GET",
      true
    );
    if (result.isError) {
      dispatch(logOutRequest());
    }
    dispatch(
      redirectTo({
        path: AppRoutes.DASHBOARD.url
      })
    );
    done();
  }
});

/**
 *
 */
export const LoginLogics = [
  loginLogic,
  logOutLogic,
  forgetPasswordLogic,
  verifyResetTokenLogic,
  resetPasswordLogic,
  verifyAccountAccessLogic
];
