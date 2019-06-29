import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { timelogActions, showLoader, hideLoader, modelOpenRequest, getOrderDetailsRequest } from "../actions";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";

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

const addTimeLogLogic = createLogic({
  type: timelogActions.ADD_TIME_LOG_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader())
    const result = await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/addTimeLogs",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(getOrderDetailsRequest({ _id: action.payload.orderId }))
      dispatch(
        modelOpenRequest({
          modelDetails: {
            timeClockModalOpen: false
          }
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});
const updateTimeLogLogic = createLogic({
  type: timelogActions.UPDATE_TIME_LOG_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader())
    const result = await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/updateTimeLogs",
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(getOrderDetailsRequest({ _id: action.payload.orderId }))
      dispatch(
        modelOpenRequest({
          modelDetails: {
            timeClockEditModalOpen: false
          }
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

export const TimeClockLogic = [
  startTimerLogic,
  addTimeLogLogic,
  updateTimeLogLogic];
