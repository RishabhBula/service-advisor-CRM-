import { handleActions } from "redux-actions";
import { usersActions } from "../actions";

const initialState = {
  users: [],
  isLoading: true,
  totalUsers: 100,
  userData: {
    isSuccess: false,
    isEditSuccess: false,
    data: {}
  }
};

export const usersReducer = handleActions(
  {
    [usersActions.GET_USER_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [usersActions.ADD_USER]: (state, action) => ({
      ...state,
      userData: {
        ...state.userData,
        isSuccess: false
      }
    }),
    [usersActions.ADD_USER_SUCCESS]: (state, action) => ({
      ...state,
      userData: {
        isSuccess: true,
        data: {}
      }
    }),
    [usersActions.EDIT_USER]: (state, action) => ({
      ...state,
      userData: {
        ...state.userData,
        isEditSuccess: false
      }
    }),
    [usersActions.EDIT_USER_SUCCESS]: (state, action) => ({
      ...state,
      userData: {
        ...state.userData,
        isEditSuccess: true
      }
    })
  },
  initialState
);
