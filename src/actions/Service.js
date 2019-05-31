import { createAction } from "redux-actions";

export const serviceActions = {
    GET_SERVICE_LIST: "Service list Requested!",
    GET_SERVICE_LIST_SUCCESS: "Service list success!",
    ADD_SERVICE: "Add new service Requested!",
    ADD_SERVICE_SUCCESS: "Add new service Success!",
    EDIT_SERVICE: "Edit service Requested!",
    EDIT_SERVICE_SUCCESS: "Edit service Success!",
    DELETE_SERVICE: "Delete service Requested!",
};

export const getServiceList = createAction(serviceActions.GET_SERVICE_LIST);
export const getServiceListSuccess = createAction(
    serviceActions.GET_SERVICE_LIST_SUCCESS
);
export const addNewService = createAction(serviceActions.ADD_SERVICE);
export const addServiceSuccess = createAction(serviceActions.ADD_SERVICE_SUCCESS);
export const editService = createAction(serviceActions.EDIT_SERVICE);
export const editServiceSuccess = createAction(serviceActions.EDIT_SERVICE_SUCCESS);
export const deleteService = createAction(serviceActions.DELETE_SERVICE);