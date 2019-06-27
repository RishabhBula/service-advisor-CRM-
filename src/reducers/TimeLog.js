import { handleActions } from "redux-actions";
import { timelogActions } from "../actions";

const initialState = {};

export const timelogReducer = handleActions(
  {
    [timelogActions.START_TIMER]: (state, { payload }) => ({
      ...state,
      ...payload
    })
  },
  initialState
);
