import { handleActions } from "redux-actions";
import { matrixActions } from "./../actions";

const initialAuthState = {
  matrixList: []
};

export const matrixListReducer = handleActions(
    {
    [matrixActions.GET_MATRIX_LIST_START]: (state, action) => ({
        ...state,
        matrixList: action.payload.matrixList
    }),
    [matrixActions.GET_MATRIX_LIST_SUCCESS]: (state, action) => ({
        ...state,
        matrixList: action.payload.matrixList
    }),
    [matrixActions.GET_MATRIX_LIST_FAILED]: (state, action) => ({
        ...state,
        matrixList: action.payload.matrixList
    })
    },
    initialAuthState
);
