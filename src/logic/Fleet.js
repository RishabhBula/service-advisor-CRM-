import { createLogic } from "redux-logic";
import {
  fleetAddStarted,
  fleetAddActions,
  fleetAddSuccess,
  redirectTo,
  hideLoader,
  showLoader,
  fleetListActions,
  fleetListStarted,
  fleetListSuccess,
  fleetEditSuccess,
  fleetEditAction
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { logger } from "../helpers/Logger";
import { AppConfig } from "../config/AppConfig";

const fleetAddLogic = createLogic({
  type: fleetAddActions.FLEET_ADD_REQUEST,
  cancelType: fleetAddActions.FLEET_ADD_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      fleetAddStarted({
        fleetData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "fleet/addFleet",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      dispatch(fleetAddSuccess());
      dispatch(redirectTo({ path: "/fleets" }));
      done();
    }
  }
});
const fleetListLogic = createLogic({
  type: fleetListActions.FLEET_LIST_REQUEST,
  cancelType: fleetListActions.FLEET_LIST_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      fleetListStarted({
        fleetData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "fleet/fleetList",
      "GET",
      true,
      {
        ...action.payload,
        limit: AppConfig.ITEMS_PER_PAGE,
      },
      undefined,
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(
        fleetListSuccess({
          fleetData: result.data.data
        }),
        hideLoader()
      );
      done();
    }
  }
});
const editFleetLogic = createLogic({
  type: fleetEditAction.EDIT_FLEET_REQUESTED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/fleet",
      "/updateFleet",
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(fleetEditSuccess());
      dispatch(hideLoader());
      done();
    }
  },
});

export const FleetLogic = [fleetAddLogic, fleetListLogic, editFleetLogic];
