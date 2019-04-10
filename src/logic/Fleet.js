import { createLogic } from "redux-logic";
import {
  fleetAddFailed,
  fleetAddStarted,
  fleetAddActions,
  redirectTo,
  hideLoader
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { push } from "react-router-redux";
import { toast } from "react-toastify";

const fleetAddLogic = createLogic({
  type: fleetAddActions.FLEET_ADD_REQUEST,
  cancelType: fleetAddActions.FLEET_ADD_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      fleetAddStarted({
        fleetData: []
      })
    );
    console.log("*********This is fleet action", action.payload);
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
      dispatch(redirectTo({ path: "/fleets" }));
      done();
    }
  }
});

export const FleetAddLogic = [fleetAddLogic];