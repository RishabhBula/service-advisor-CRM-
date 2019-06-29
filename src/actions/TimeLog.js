import { createAction } from "redux-actions";

export const timelogActions = {
  START_TIMER: "Start timer for technician!",
  ADD_TIME_LOG_REQUEST: "Add time logs request",
  ADD_TIME_LOG_SUCCESS: "Add time logs success",
  GET_TIME_LOG_REQUEST: "Get time logs list request",
  GET_TIME_LOG_SUCCESS: "Get time logs list success",
  UPDATE_TIME_LOG_REQUEST: "Update time log request",
  UPDATE_TIME_LOG_SUCCESS: "Update time log success",
};

export const startTimer = createAction(timelogActions.START_TIMER);
export const addTimeLogRequest = createAction(timelogActions.ADD_TIME_LOG_REQUEST);
export const addTimeLogSuccess = createAction(timelogActions.ADD_TIME_LOG_SUCCESS);
export const getTimeLogsRequest = createAction(timelogActions.GET_TIME_LOG_REQUEST);
export const getTimeLogsSuccess = createAction(timelogActions.GET_TIME_LOG_SUCCESS);
export const updateTimeLogRequest = createAction(timelogActions.UPDATE_TIME_LOG_REQUEST);
export const updateTimeLogSuccess = createAction(timelogActions.UPDATE_TIME_LOG_SUCCESS);