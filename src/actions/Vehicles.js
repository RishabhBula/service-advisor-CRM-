import { createAction } from 'redux-actions';

export const vehicleActions = {
    VEHICLES_ADD_REQUEST: 'Vehicles add Requested!',
    VEHICLES_ADD_SUCCESS: 'Vehicles add successfully!',
    VEHICLES_ADD_FAILED: 'Vehicles add failed!',
    VEHICLES_ADD_START: 'Vehicles add Started!',

    VEHICLES_GET_REQUEST: "Vehicles Get Requested!",
    VEHICLES_GET_START: "Vehicles get Started!",
    VEHICLES_GET_SUCCESS: "Vehicles Get successfully!",
    VEHICLES_GET_FAILED: "Vehicles Get failed!",

    DELETE_VEHICLE: "Delete vehicle Requested!",

    EDIT_VEHICLE_REQUESTED: "Edit VEHICLE Requested!",
    EDIT_VEHICLE_SUCCESS: "Edit VEHICLE Success!",
}

export const vehicleAddRequest = createAction(vehicleActions.VEHICLES_ADD_REQUEST);
export const vehicleAddStarted = createAction(vehicleActions.VEHICLES_ADD_START);
export const vehicleAddSuccess = createAction(vehicleActions.VEHICLES_ADD_SUCCESS);
export const vehicleAddFailed = createAction(vehicleActions.VEHICLES_ADD_FAILED);

export const vehicleGetRequest = createAction(vehicleActions.VEHICLES_GET_REQUEST);
export const vehicleGetStarted = createAction(vehicleActions.VEHICLES_GET_START);
export const vehicleGetSuccess = createAction(vehicleActions.VEHICLES_GET_SUCCESS);
export const vehicleGetFailed = createAction(vehicleActions.VEHICLES_GET_FAILED);



export const deleteVehicle = createAction(vehicleActions.DELETE_VEHICLE);

export const vehicleEditRequest = createAction(
  vehicleActions.EDIT_VEHICLE_REQUESTED
);
export const vehicleEditSuccess = createAction(
    vehicleActions.EDIT_VEHICLE_SUCCESS
);

