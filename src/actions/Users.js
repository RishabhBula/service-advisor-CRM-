import { createAction } from "redux-actions";

export const usersActions = {
  GET_USER_LIST: "User list Requested!",
  GET_USER_LIST_SUCCESS: "User list success!",
  ADD_USER: "Add new user Requested!",
  ADD_USER_SUCCESS: "Add new user Success!",
  DELETE_USER: "Delete user Requested!",
};

export const getUsersList = createAction(usersActions.GET_USER_LIST);
export const getUsersListSuccess = createAction(
  usersActions.GET_USER_LIST_SUCCESS
);
export const addNewUser = createAction(usersActions.ADD_USER);
export const addUserSuccess = createAction(usersActions.ADD_USER_SUCCESS);
export const deleteUser = createAction(usersActions.DELETE_USER);
