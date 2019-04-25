import { handleActions } from 'redux-actions';
import { labourListActions, labourAddActions, labourEditAction, } from "./../actions";

const initialAuthState = {
    labourData: [],
    isLoading: false,
    totalFleets: 100,
    isSuccess: false,
    isEditSuccess: false,
};

export const labourReducer = handleActions((
    {
        [labourListActions.LABOUR_LIST_START]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
        }),
        [labourListActions.LABOUR_LIST_SUCCESS]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
        }),
        [labourListActions.LABOUR_LIST_FAILED]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
        }),
        [labourAddActions.LABOUR_ADD_SUCCESS]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
            isSuccess: true,
        }),
        [labourEditAction.EDIT_LABOUR_SUCCESS]: (state, action) => ({
            ...state,
            labourData: action.payload.labourData,
            isEditSuccess: true,
        }),
    
    }),
    initialAuthState
);