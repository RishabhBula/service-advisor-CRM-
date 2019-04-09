import { createAction } from "redux-actions";

export const fleetActions = {
  GET_FLEET_LIST: "Fleet list Requested!",
  GET_FLEET_LIST_SUCCESS: "Fleet list success!",
  ADD_FLEET: "Add new fleet Requested!"
};

export const getFleetList = createAction(fleetActions.GET_FLEET_LIST);
export const getFleetListSuccess = createAction(
  fleetActions.GET_FLEET_LIST_SUCCESS
);
export const addNewFleet = createAction(fleetActions.ADD_FLEET);

