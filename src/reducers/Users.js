import { handleActions } from "redux-actions";
import { usersActions } from "../actions";

const initialState = {
  users: [],
  isLoading: true,
};

export const usersReducer = handleActions(
  {
    [usersActions.GET_USER_LIST_SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  initialState
);
