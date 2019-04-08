import { handleActions } from "redux-actions";
import { usersActions } from "../actions";

const initialState = {
  users: [],
  isLoading: true,
  totalUsers: 100,
  userData: {
    isSuccess: false,
    data: {},
  },
};

export const usersReducer = handleActions(
  {
    [usersActions.GET_USER_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [usersActions.ADD_USER_SUCCESS]: (state, action) => ({
      ...state,
      userData: {
        isSuccess: true,
        data: {},
      },
    }),
  },
  initialState
);
