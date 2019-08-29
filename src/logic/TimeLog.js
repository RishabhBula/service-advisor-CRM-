import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  timelogActions,
  getOrderIdSuccess,
  showLoader,
  hideLoader,
  modelOpenRequest,
  // getUsersList,
  getOrderDetailsRequest,
  getTechinicianTimeLogSuccess,
  getAllTimeLogSuccess,
  getAllTimeLogRequest
} from "../actions";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
import { AppConfig } from "../config/AppConfig";
/**
 *
 */
const startTimerLogic = createLogic({
  type: timelogActions.START_TIMER,
  async process({ action, getState }, dispatch, done) {
    const { orderItems } = getState().orderReducer;
    const { serviceId: mainServices } = orderItems;
    const { technicianId, serviceId, orderId } = action.payload;
    if (serviceId) {
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
    }
    await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/start-time-clock",
      "POST",
      true,
      undefined,
      {
        technicianId,
        serviceId: serviceId ? serviceId : null,
        orderId: orderId ? orderId : null
      }
    );
    // if (!serviceId) {
    //   dispatch(getUsersList({ page: 1 }))
    // }
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
    if (serviceId) {
      const index = mainServices.findIndex(
        d => d.serviceId.technician._id === technicianId
      );
      mainServices[index].serviceId.technician = {
        ...mainServices[index].serviceId.technician,
        currentlyWorking: {}
      };
    }
    await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/stop-time-clock",
      "POST",
      true,
      undefined,
      { technicianId, serviceId, orderId }
    );
    if (serviceId) {
      dispatch(
        getOrderIdSuccess({
          ...orderItems,
          serviceId: mainServices
        })
      );
    }
    if (!serviceId) {
      // dispatch(getUsersList({ page: 1 }))
      dispatch(getAllTimeLogRequest())
    }
    if (serviceId) {
      dispatch(getOrderDetailsRequest({ _id: orderId }))
    }
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
    if (!serviceId || oldService === serviceId) {
      toast.error("Please select a service.");
      return;
    }
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
    dispatch(showLoader());
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
      dispatch(getOrderDetailsRequest({ _id: action.payload.orderId }));
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
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      if (action.payload.isTimerClock) {
        dispatch(getAllTimeLogRequest());
        done();
      } else {
        dispatch(getOrderDetailsRequest({ _id: action.payload.orderId }));
        dispatch(
          modelOpenRequest({
            modelDetails: {
              timeClockEditModalOpen: false
            }
          })
        );
        done();
      }
    }
  }
});
/**
 *
 */
const getTechnicianTimeLogLogic = createLogic({
  type: timelogActions.GET_TECHNICIAN_TIME_LOGS_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    const result = await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/technicianTimeLogs",
      "GET",
      true,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(hideLoader());
      done();
      return;
    } else {
      dispatch(getTechinicianTimeLogSuccess(result.data.data));
      dispatch(hideLoader());
      done();
    }
  }
});
/**
 *
 */
const getAllTimeLogLogic = createLogic({
  type: timelogActions.GET_ALL_TIME_LOGS_REQUEST,
  async process({ action }, dispatch, done) {
    const result = await new ApiHelper().FetchFromServer(
      "/timeClock",
      "/allTimeLogs",
      "GET",
      true,
      {
        search: action.payload && action.payload.search ? action.payload.search : null,
        page: action.payload && action.payload.page ? action.payload.page : null,
        limit: AppConfig.ITEMS_PER_PAGE,
      }
    );
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(hideLoader());
      done();
      return;
    } else {
      dispatch(getAllTimeLogSuccess(
        {
          timeLogs: result.data.data,
          totalDuration: result.data.totalDuration,
          totalTimeLogs: result.data.totalTimeLogs
        }
      ));
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
  updateTimeLogLogic,
  getTechnicianTimeLogLogic,
  getAllTimeLogLogic
];
