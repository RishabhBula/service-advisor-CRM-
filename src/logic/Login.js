import { push } from "react-router-redux";
import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  loginActions,
  loginStarted,
  loginFailed,
  loginSuccess,
  logOutSuccess,
} from "./../actions";

export const loginLogic = createLogic({
  type: loginActions.LOGIN_REQUEST,
  cancelType: loginActions.LOGIN_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      loginStarted({
        isLoggingIn: true,
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/user",
      "/login",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      dispatch(
        loginFailed({
          isLoggingIn: false,
          isLoggedIn: false,
          token: "",
        })
      );
      done();
      toast.success(result.messages[0]);
      return;
    } else {
      var localStorage_array = { token: result.data.token, isLoggingIn: true };
      localStorage.setItem(
        "localStorageVal",
        JSON.stringify(localStorage_array)
      );
      dispatch(
        loginSuccess({
          isLoggingIn: false,
          isLoggedIn: true,
          token: result.data.token,
        })
      );
      toast.success("You have logged in successfully");
      done();
    }
  },
});

export const logOutLogic = createLogic({
  type: loginActions.LOGOUT_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      logOutSuccess({
        isLoggingIn: false,
        isLoggedIn: false,
        token: "",
      })
    );
    localStorage.removeItem("localStorageVal");
    localStorage.removeItem("giftCartProduct");
    localStorage.removeItem("cartProduct");
    dispatch(push("/login"));
    done();
  },
});
