import { createLogic } from "redux-logic";
import {
  dashboardActions,
  showLoader,
  getDashboardOverviewSuccess
} from "../actions";
import { logger, ApiHelper } from "../helpers";
/**
 *
 */
const getOverviewLogic = createLogic({
  type: dashboardActions.GET_DASHBOARD_OVERVIEW,
  async process({ action, getState }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    const result = await new ApiHelper().FetchFromServer(
      "/dashboard",
      "/overview",
      "GET",
      true
    );
    logger(result);
    const oldState = getState().dashboardReducer;
    dispatch(
      getDashboardOverviewSuccess(
        result.isError ? oldState.overview : result.data.data
      )
    );
    done();
  }
});
/**
 *
 */
const getCustomerSalesLogic = createLogic({
  type: dashboardActions.GET_DASHBOARD_CUSTOMER_SALE,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    const result = await new ApiHelper().FetchFromServer(
      "/dashboard",
      "/customers-sales",
      "GET",
      true
    );
    logger(result);

    done();
  }
});
/**
 *
 */
export const DashboardLogics = [getOverviewLogic, getCustomerSalesLogic];
