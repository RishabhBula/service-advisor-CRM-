import { createAction } from "redux-actions";

export const loginActions = {
  LOGIN_REQUEST: "Login Requested!",
  LOGOUT_REQUEST: "Logout Started!",
};

export const loginRequest = createAction(loginActions.LOGIN_REQUEST);
export const logOutRequest = createAction(loginActions.LOGOUT_REQUEST);
