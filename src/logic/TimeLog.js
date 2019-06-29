import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { timelogActions,getOrderIdSuccess, showLoader, hideLoader, modelOpenRequest, getOrderDetailsRequest } from "../actions";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
/**
 *
 */
const startTimerLogic = createLogic({
  type: timelogActions.START_TIMER,
  async process({ action, getState }, dispatch, done) {
    const { orderItems } = getState().orderReducer;
    const { serviceId: mainServices } = orderItems;
    const { technicianId, serviceId, orderId } = action.payload;
    const index = mainServices.findIndex(
      d => d.serviceId.technician._id === technicianId
    );
    mainServices[index].serviceId.technician = {
      ...mainServices[index].serviceId.technician,
      currentlyWorking: {
        serviceId,
        orderId,
        startTime: new Date().toUTCString()
      }
    };
    await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/start-time-clock",
      "POST",
      true,
      undefined,
      { technicianId, serviceId, orderId }
    );

    dispatch(
      getOrderIdSuccess({
        ...orderItems,
        serviceId: mainServices
      })
    );
    done();
  }
});
/**
 *
 */
const stopTimerLogic = createLogic({
  type: timelogActions.STOP_TIMER,
  async process({ action, getState }, dispatch, done) {
    const { orderItems } = getState().orderReducer;
    const { serviceId: mainServices } = orderItems;
    const { technicianId, serviceId, orderId } = action.payload;
    const index = mainServices.findIndex(
      d => d.serviceId.technician._id === technicianId
    );
    mainServices[index].serviceId.technician = {
      ...mainServices[index].serviceId.technician,
      currentlyWorking: {}
    };
    await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/stop-time-clock",
      "POST",
      true,
      undefined,
      { technicianId, serviceId, orderId }
    );
    dispatch(
      getOrderIdSuccess({
        ...orderItems,
        serviceId: mainServices
      })
    );
    done();
  }
});

/**
 *
 */
const switchTaskLogic = createLogic({
  type: timelogActions.SWITCH_TIMER,
  async process({ action, getState }, dispatch, done) {
    const { orderItems } = getState().orderReducer;
    const { serviceId: mainServices } = orderItems;
    const { technicianId, serviceId, orderId, oldService } = action.payload;
    const technicians = mainServices.filter(
      d => d.serviceId.technician._id === technicianId
    );
    for (let index = 0; index < technicians.length; index++) {
      mainServices[index].serviceId.technician = {
        ...mainServices[index].serviceId.technician,
        currentlyWorking: {
          serviceId,
          orderId,
          startTime: Date.now()
        }
      };
    }
    await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/switch-task",
      "PATCH",
      true,
      undefined,
      { technicianId, serviceId, orderId, oldService }
    );

    dispatch(
      getOrderIdSuccess({
        ...orderItems,
        serviceId: mainServices
      })
    );
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

/**
 *
 */
export const TimeClockLogic = [
  startTimerLogic,
  stopTimerLogic,
  switchTaskLogic,
  addTimeLogLogic,
  updateTimeLogLogic
];
