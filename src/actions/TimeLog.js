import { createAction } from "redux-actions";

export const timelogActions = {
  START_TIMER: "Start timer for technician!",
  STOP_TIMER: "Stop timer for technician!"
};

export const startTimer = createAction(timelogActions.START_TIMER);
export const stopTimer = createAction(timelogActions.STOP_TIMER);
