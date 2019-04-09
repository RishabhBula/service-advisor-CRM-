import { createAction } from "redux-actions";

export const matrixActions = {
    GET_MATRIX_LIST: "Matrix list Requested!",
    GET_MATRIX_LIST_SUCCESS: "Matrix list success!",
    GET_MATRIX_LIST_FAILED: 'Matrix list failed!',
    GET_MATRIX_LIST_START: 'Matrix list Started!'
};

export const getMatrixList = createAction(matrixActions.GET_MATRIX_LIST);
export const getMatrixListSuccess = createAction(
         matrixActions.GET_MATRIX_LIST_SUCCESS
       );
export const getMatrixListFail = createAction(
         matrixActions.GET_MATRIX_LIST_FAILED
       );
export const getMatrixListStart = createAction(
         matrixActions.GET_MATRIX_LIST_START
       );
