import { handleActions } from "redux-actions";
import { usersActions, timelogActions } from "../actions";

const initialState = {
  users: [],
  isLoading: true,
  totalUsers: 0,
  technicianData: [],
  isStartTimer: false,
  userData: {
    isSuccess: false,
    isEditSuccess: false,
    data: {}
  }
};

export const usersReducer = handleActions(
  {
    [usersActions.GET_USER_LIST]: (state, { payload }) => ({
      users: [],
      isLoading: true
    }),
    [usersActions.GET_USER_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      ...payload,
      isLoading: false
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
      },
    }),
    [usersActions.GET_SINGLE_USER_DETAILS_REQUEST]: (state, action) => ({
      ...state,
      technicianData: []
    }),
    [usersActions.GET_SINGLE_USER_DETAILS_SUCCESS]: (state, action) => ({
      ...state,
      technicianData: action.payload
    }),
    [timelogActions.START_TIMER]: (state, action) => ({
      ...state,
      isStartTimer: true
    }),
    [timelogActions.STOP_TIMER]: (state, action) => ({
      ...state,
      isStartTimer: false
    })
  },
  initialState
);
