import { createLogic } from "redux-logic";
import {
  appointmentActions,
  showLoader,
  hideLoader,
  getAppointments,
  getAppointmentsSuccess,
  modelOpenRequest,
  getAppointmentDetailsSuccess
} from "../actions";
import { ApiHelper } from "../helpers";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";

/**
 *
 */
const getAppointmentLogic = createLogic({
  type: appointmentActions.GET_APPOINTMENT_LIST,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/appointment",
      "/",
      "GET",
      true,
      payload
    );
    if (result.isError) {
      dispatch(toast.error(result.messages[0] || DefaultErrorMessage));
      dispatch(
        getAppointmentsSuccess({
          data: []
        })
      );
      done();
      return;
    }
    dispatch(
      getAppointmentsSuccess({
        data: result.data.data
      })
    );
    done();
  }
});
/**
 *
 */
const addAppointmentLogic = createLogic({
  type: appointmentActions.ADD_APPOINTMENT_REQUEST,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    dispatch(showLoader());
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/appointment",
      "/",
      "POST",
      true,
      undefined,
      payload
    );
    if (result.isError) {
      dispatch(toast.error(result.messages[0] || DefaultErrorMessage));
      dispatch(hideLoader());
      done();
      return;
    }
    dispatch(toast.success(result.messages[0]));
    dispatch(getAppointments());
    dispatch(
      modelOpenRequest({
        modelDetails: {
          showAddAppointmentModal: false
        }
      })
    );
    dispatch(hideLoader());
    done();
  }
});

/**
 *
 */
const getAppointmentDetailsLogic = createLogic({
  type: appointmentActions.GET_APPOINTMENT_DETAILS_REQUEST,
  async process({ action }, dispatch, done) {
    const { payload } = action;
    const { eventId } = payload;
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/appointment",
      `/${eventId}`,
      "GET",
      true
    );
    dispatch(getAppointmentDetailsSuccess({ data: result.data.data }));
    done();
  }
});
/**
 *
 */
export const AppointmentLogics = [
  addAppointmentLogic,
  getAppointmentLogic,
  getAppointmentDetailsLogic
];
