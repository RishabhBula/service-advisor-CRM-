import { createAction } from "redux-actions";

export const labourAddActions = {
  LABOUR_ADD_REQUEST: 'LabourAdd Requested!',
  LABOUR_ADD_SUCCESS: 'LabourAdd successfully!',
  LABOUR_ADD_FAILED: 'LabourAdd failed!',
  LABOUR_ADD_START: 'LabourAdd Started!'
};

export const labourAddRequest = createAction(labourAddActions.LABOUR_ADD_REQUEST);
export const labourAddStarted = createAction(labourAddActions.LABOUR_ADD_START);
export const labourAddSuccess = createAction(labourAddActions.LABOUR_ADD_SUCCESS);
export const labourAddFailed = createAction(labourAddActions.LABOUR_ADD_FAILED);


export const labourListActions = {
  LABOUR_LIST_REQUEST: 'LabourList Requested!',
  LABOUR_LIST_SUCCESS: 'LabourList successfully!',
  LABOUR_LIST_FAILED: 'LabourList failed!',
  LABOUR_LIST_START: 'LabourList Started!'
}

export const labourListRequest = createAction(labourListActions.LABOUR_LIST_REQUEST);
export const labourListStarted = createAction(labourListActions.LABOUR_LIST_START);
export const labourListSuccess = createAction(labourListActions.LABOUR_LIST_SUCCESS);
export const labourListFailed = createAction(labourListActions.LABOUR_LIST_FAILED);

export const labourEditAction = {
  EDIT_LABOUR_REQUESTED: "Edit labour Requested!",
  EDIT_LABOUR_SUCCESS: "Edit labour Success!",
}

export const labourEditRequest = createAction(labourEditAction.EDIT_LABOUR_REQUESTED)
export const labourEditSuccess = createAction(labourEditAction.EDIT_LABOUR_SUCCESS)

export const labourDeleteActions = {
  DELETE_LABOUR: "Delete labour Requested!",
}
export const deleteLabour = createAction(labourDeleteActions.DELETE_LABOUR);

export const labourUpdateStatusAction = {
  UPDATE_LABOUR_STATUS: "Update labour status Requested!"
}
export const updateLabourStatus = createAction(labourUpdateStatusAction.UPDATE_LABOUR_STATUS);
