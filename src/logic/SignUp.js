import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  signUpActions,
  showLoader,
  hideLoader,
  redirectTo,
} from "./../actions";

const signUpLogic = createLogic({
  type: signUpActions.SIGNUP_REQUEST,
  cancelType: signUpActions.SIGNUP_FAILED,
  async process({ action }, dispatch, done) {
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
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      dispatch(redirectTo({ path: "/login" }));
      done();
    }
  },
});

export const SignUpLogic = [signUpLogic];
