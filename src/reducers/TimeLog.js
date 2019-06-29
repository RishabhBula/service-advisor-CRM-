import { handleActions } from "redux-actions";
import { timelogActions } from "../actions";

const initialState = {
  isSuccess: false,
  timeLogData: []
};

export const timelogReducer = handleActions(
  {
    [timelogActions.START_TIMER]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [timelogActions.ADD_TIME_LOG_REQUEST]: (state, { payload }) => ({
      ...state,
      isSuccess: false
    }),
    [timelogActions.ADD_TIME_LOG_SUCCESS]: (state, { payload }) => ({
      ...state,
      isSuccess: true
    }),
    [timelogActions.GET_TIME_LOG_REQUEST]: (state, { payload }) => ({
      ...state,
      timeLogData: [],
      isSuccess: false
    }),
    [timelogActions.GET_TIME_LOG_SUCCESS]: (state, { payload }) => ({
      ...state,
      timeLogData: payload.timeLog,
      isSuccess: true
    })
  },
  initialState
);
