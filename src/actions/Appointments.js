import { createAction } from "redux-actions";

export const appointmentActions = {
  GET_APPOINTMENT_LIST: "Get Appointment list request!",
  GET_APPOINTMENT_LIST_SUCCESS: "Get Appointment list success!",
  ADD_APPOINTMENT_REQUEST: "Add Appointment Request!",
  GET_APPOINTMENT_DETAILS_REQUEST: "Get Appointment details Request!",
  GET_APPOINTMENT_DETAILS_SUCCESS: "Get Appointment details list success!"
};

export const getAppointments = createAction(
  appointmentActions.GET_APPOINTMENT_LIST
);
export const getAppointmentsSuccess = createAction(
  appointmentActions.GET_APPOINTMENT_LIST_SUCCESS
);
export const addAppointmentRequest = createAction(
  appointmentActions.ADD_APPOINTMENT_REQUEST
);
export const getAppointmentDetails = createAction(
  appointmentActions.GET_APPOINTMENT_DETAILS_REQUEST
);
export const getAppointmentDetailsSuccess = createAction(
  appointmentActions.GET_APPOINTMENT_DETAILS_SUCCESS
);
