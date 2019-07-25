import { handleActions } from "redux-actions";
import { dashboardActions } from "../actions";

/**
 *
 */
const initialState = {
  overview: {
    customerCount: 0,
    orderCount: 0,
    technicianCount: 0,
    vehicleCount: 0,
    isLoading: true
  }
};

export const dashboardReducer = handleActions(
  {
    [dashboardActions.GET_DASHBOARD_OVERVIEW]: (state, { payload }) => ({
      ...state,
      overview: {
        ...initialState.overview
      }
    }),
    [dashboardActions.GET_DASHBOARD_OVERVIEW_SUCCESS]: (
      state,
      { payload }
    ) => ({
      ...state,
      overview: {
        ...payload,
        isLoading: false
      }
    })
  },
  initialState
);
