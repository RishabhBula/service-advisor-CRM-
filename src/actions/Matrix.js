import { createAction } from "redux-actions";

export const matrixActions = {
  GET_MATRIX_LIST: "Customer list Requested!",
  GET_MATRIX_LIST_SUCCESS: "Customer list success!",
};

export const getMatrixList = createAction(matrixActions.GET_MATRIX_LIST);
export const getMatrixListSuccess = createAction(
         matrixActions.GET_MATRIX_LIST_SUCCESS
       );
