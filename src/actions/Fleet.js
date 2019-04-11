import { createAction } from "redux-actions";

export const fleetAddActions = {
  FLEET_ADD_REQUEST: 'FleetAdd Requested!',
  FLEET_ADD_SUCCESS: 'FleetAdd successfully!',
  FLEET_ADD_FAILED: 'FleetAdd failed!',
  FLEET_ADD_START: 'FleetAdd Started!'
};

export const fleetAddRequest = createAction(fleetAddActions.FLEET_ADD_REQUEST);
export const fleetAddStarted = createAction(fleetAddActions.FLEET_ADD_START);
export const fleetAddSuccess = createAction(fleetAddActions.FLEET_ADD_SUCCESS);
export const fleetAddFailed = createAction(fleetAddActions.FLEET_ADD_FAILED);


export const fleetListActions = {
  FLEET_LIST_REQUEST: 'FleetList Requested!',
  FLEET_LIST_SUCCESS: 'FleetList successfully!',
  FLEET_LIST_FAILED: 'FleetList failed!',
  FLEET_LIST_START: 'FleetList Started!'
}

export const fleetListRequest = createAction(fleetListActions.FLEET_LIST_REQUEST);
export const fleetListStarted = createAction(fleetListActions.FLEET_LIST_START);
export const fleetListSuccess = createAction(fleetListActions.FLEET_LIST_SUCCESS);
export const fleetListFailed = createAction(fleetListActions.FLEET_LIST_FAILED);

export const fleetEditAction = {
  EDIT_FLEET_REQUESTED: "Edit fleet Requested!",
  EDIT_FLEET_SUCCESS: "Edit fleet Success!",
}
 
export const fleetEditRequest = createAction(fleetEditAction.EDIT_FLEET_REQUESTED)
export const fleetEditSuccess = createAction(fleetEditAction.EDIT_FLEET_SUCCESS)
