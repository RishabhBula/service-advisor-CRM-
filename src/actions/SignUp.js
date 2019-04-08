import { createAction } from "redux-actions";

export const signUpActions = {
  SIGNUP_REQUEST: "SignUp Requested!",
  VERIFY_ACCOUNT: "Request Verify Account!",
};

export const signUpRequest = createAction(signUpActions.SIGNUP_REQUEST);
export const verifyUserAccount = createAction(signUpActions.VERIFY_ACCOUNT);
