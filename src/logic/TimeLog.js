import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { timelogActions } from "../actions";

const startTimerLogic = createLogic({
  type: timelogActions.START_TIMER,
  async process({ action, getState }, dispatch, done) {
    const { technicianId, serviceId, orderId } = action.payload;
    const result = await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/start-time-clock",
      "POST",
      true,
      undefined,
      technicianId,
      serviceId,
      orderId
    );
    console.log(result);
    done();
  }
});

export const TimeClockLogic = [startTimerLogic];
