import { createAction } from 'redux-actions';

export const loginActions = {
    LOGIN_REQUEST: 'Login Requested!',
    LOGIN_SUCCESS: 'Logged in successfully!',
    LOGIN_FAILED: 'Login failed!',
    LOGIN_START: 'Login Started!',
    LOGOUT_REQUEST: 'Logout Started!',
    LOGOUT_SUCCESS: 'Logout Success!'
}

export const loginRequest = createAction(loginActions.LOGIN_REQUEST);
export const loginStarted = createAction(loginActions.LOGIN_START);
export const loginSuccess = createAction(loginActions.LOGIN_SUCCESS);
export const loginFailed = createAction(loginActions.LOGIN_FAILED);
export const logOutRequest = createAction(loginActions.LOGOUT_REQUEST);
export const logOutSuccess = createAction(loginActions.LOGOUT_SUCCESS);
