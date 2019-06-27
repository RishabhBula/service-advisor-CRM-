import { createAction } from "redux-actions";

export const timelogActions = {
  START_TIMER: "Start timer for technician!"
};

export const startTimer = createAction(timelogActions.START_TIMER);
