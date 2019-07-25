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
  },
  customerSales: {
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
    }),
    [dashboardActions.GET_DASHBOARD_CUSTOMER_SALE]: (state, { payload }) => ({
      ...state,
      customerSales: {
        isLoading: true
      }
    }),
    [dashboardActions.GET_DASHBOARD_CUSTOMER_SALE_SUCCESS]: (
      state,
      { payload }
    ) => ({
      ...state,
      customerSales: {
        ...state.customerSales,
        ...payload,
        isLoading: false
      }
    })
  },
  initialState
);
