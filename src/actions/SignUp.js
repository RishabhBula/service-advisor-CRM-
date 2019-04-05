import { createAction } from "redux-actions";

export const signUpActions = {
  SIGNUP_REQUEST: "SignUp Requested!",
};

export const signUpRequest = createAction(signUpActions.SIGNUP_REQUEST);
