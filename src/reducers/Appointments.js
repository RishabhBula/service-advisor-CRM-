import { handleActions } from "redux-actions";
import { appointmentActions } from "../actions";

const initialAppointState = {
  isLoading: false,
  data: []
};

export const appointmentReducer = handleActions(
  {
    [appointmentActions.GET_APPOINTMENT_LIST]: (state, action) => ({
      data: [],
      isLoading: true
    }),
    [appointmentActions.GET_APPOINTMENT_LIST_SUCCESS]: (state, action) => ({
      isLoading: false,
      data: action.payload.data
    })
  },
  initialAppointState
);
/**
 *
 */
const initialAppointDetailsState = {
  isLoading: true,
  data: {}
};
/**
 *
 */
export const appointmentDetailsReducer = handleActions(
  {
    [appointmentActions.GET_APPOINTMENT_DETAILS_REQUEST]: (state, action) => ({
      data: [],
      isLoading: true
    }),
    [appointmentActions.GET_APPOINTMENT_DETAILS_SUCCESS]: (state, action) => ({
      isLoading: false,
      data: action.payload.data
    })
  },
  initialAppointDetailsState
);
