import { createAction } from "redux-actions";

export const vehicleActions = {
  VEHICLES_ADD_REQUEST: "Vehicles add Requested!",
  VEHICLES_ADD_SUCCESS: "Vehicles add successfully!",
  VEHICLES_ADD_FAILED: "Vehicles add failed!",
  VEHICLES_ADD_START: "Vehicles add Started!",

  VEHICLES_GET_REQUEST: "Vehicles Get Requested!",
  VEHICLES_GET_START: "Vehicles get Started!",
  VEHICLES_GET_SUCCESS: "Vehicles Get successfully!",
  VEHICLES_GET_FAILED: "Vehicles Get failed!",

  DELETE_VEHICLE: "Delete vehicle Requested!",
  UPDATE_VEHICLE_STATUS: "Update vehicle status Requested!",

  EDIT_VEHICLE_REQUESTED: "Edit VEHICLE Requested!",
  EDIT_VEHICLE_SUCCESS: "Edit VEHICLE Success!",
  IMPORT_VEHICLE_REQUEST: "Request to import VEHICLE!",
  IMPORT_VEHICLE_REQ_UPDATE: "Update request to import VEHICLE!",
  EXPORT_VEHICLES: "Export Vehicles!"
};

export const vehicleAddRequest = createAction(
  vehicleActions.VEHICLES_ADD_REQUEST
);
export const vehicleAddStarted = createAction(
  vehicleActions.VEHICLES_ADD_START
);
export const vehicleAddSuccess = createAction(
  vehicleActions.VEHICLES_ADD_SUCCESS
);
export const vehicleAddFailed = createAction(
  vehicleActions.VEHICLES_ADD_FAILED
);

export const vehicleGetRequest = createAction(
  vehicleActions.VEHICLES_GET_REQUEST
);
export const vehicleGetStarted = createAction(
  vehicleActions.VEHICLES_GET_START
);
export const vehicleGetSuccess = createAction(
  vehicleActions.VEHICLES_GET_SUCCESS
);
export const vehicleGetFailed = createAction(
  vehicleActions.VEHICLES_GET_FAILED
);

export const deleteVehicle = createAction(vehicleActions.DELETE_VEHICLE);
export const updateVehicleStatus = createAction(
  vehicleActions.UPDATE_VEHICLE_STATUS
);

export const vehicleEditRequest = createAction(
  vehicleActions.EDIT_VEHICLE_REQUESTED
);
export const vehicleEditSuccess = createAction(
  vehicleActions.EDIT_VEHICLE_SUCCESS
);

export const importVehicle = createAction(
  vehicleActions.IMPORT_VEHICLE_REQUEST
);

export const updateImportVehicleReq = createAction(
  vehicleActions.IMPORT_VEHICLE_REQ_UPDATE
);

export const exportVehicles = createAction(vehicleActions.EXPORT_VEHICLES);
