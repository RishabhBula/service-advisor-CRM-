import { createAction } from "redux-actions";

export const timelogActions = {
  START_TIMER: "Start timer for technician!",
  ADD_TIME_LOG_REQUEST: "Add time logs request",
  ADD_TIME_LOG_SUCCESS: "Add time logs success",
  GET_TIME_LOG_REQUEST: "Get time logs list request",
  GET_TIME_LOG_SUCCESS: "Get time logs list success",
  UPDATE_TIME_LOG_REQUEST: "Update time log request",
  UPDATE_TIME_LOG_SUCCESS: "Update time log success",
  STOP_TIMER: "Stop timer for technician!",
  SWITCH_TIMER: "Switch task timer for technician!",
  GET_TECHNICIAN_TIME_LOGS_REQUEST: "Get technician time logs request!",
  GET_TECHNICIAN_TIME_LOGS_SUCCESS: "Get technician time logs success!"
};

export const startTimer = createAction(timelogActions.START_TIMER);
export const addTimeLogRequest = createAction(timelogActions.ADD_TIME_LOG_REQUEST);
export const addTimeLogSuccess = createAction(timelogActions.ADD_TIME_LOG_SUCCESS);
export const getTimeLogsRequest = createAction(timelogActions.GET_TIME_LOG_REQUEST);
export const getTimeLogsSuccess = createAction(timelogActions.GET_TIME_LOG_SUCCESS);
export const updateTimeLogRequest = createAction(timelogActions.UPDATE_TIME_LOG_REQUEST);
export const updateTimeLogSuccess = createAction(timelogActions.UPDATE_TIME_LOG_SUCCESS);
export const stopTimer = createAction(timelogActions.STOP_TIMER);
export const switchTask = createAction(timelogActions.SWITCH_TIMER);
/* 
 */
export const getTechinicianTimeLogRequest = createAction(timelogActions.GET_TECHNICIAN_TIME_LOGS_REQUEST)
export const getTechinicianTimeLogSuccess = createAction(timelogActions.GET_TECHNICIAN_TIME_LOGS_SUCCESS)
