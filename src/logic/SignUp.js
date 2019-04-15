import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  signUpActions,
  showLoader,
  hideLoader,
  redirectTo
} from "./../actions";

const signUpLogic = createLogic({
  type: signUpActions.SIGNUP_REQUEST,
  cancelType: signUpActions.SIGNUP_FAILED,
  async process({ action }, dispatch, done) {
    localStorage.removeItem("userId");
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/signup",
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
      // toast.success(result.messages[0]);
      localStorage.setItem("userId", result.data.user);
      dispatch(hideLoader());
      // dispatch(redirectTo({ path: "/login" }));
      done();
    }
  }
});
const verifyAccountLogic = createLogic({
  type: signUpActions.VERIFY_ACCOUNT,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/confirmation",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      dispatch(
        redirectTo({
          path: "/404"
        })
      );
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      dispatch(redirectTo({ path: "/login" }));
      done();
    }
  }
});
const verifyGeneratePasswordLogic = createLogic({
  type: signUpActions.VERIFY_GENERATE_PASSWORD,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/verfiyUserLink",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
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
      done();
    }
  }
});

const generatePasswordLogic = createLogic({
  type: signUpActions.GENERATE_PASSWORD,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/verfiyUser",
      "POST",
      false,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      dispatch(
        redirectTo({
          path: "/404"
        })
      );
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      dispatch(redirectTo({ path: "/login" }));
      done();
    }
  }
});
const resendConfiramtionLinkLogic = createLogic({
  type: signUpActions.RESEND_LINK,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/resend-confirmation",
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
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      done();
    }
  }
});

export const SignUpLogic = [
  signUpLogic,
  verifyAccountLogic,
  generatePasswordLogic,
  verifyGeneratePasswordLogic,
  resendConfiramtionLinkLogic
];
