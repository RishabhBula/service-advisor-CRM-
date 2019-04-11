import { handleActions } from 'redux-actions';
import { fleetListActions, fleetAddActions, fleetEditAction } from "./../actions";

const initialAuthState = {
    fleetData: [],
    isLoading: false,
    totalFleets: 100,
    fleetListData: {
        isSuccess: false,
        isEditSuccess: false,
        data: {},
    },
};

export const fleetReducer = handleActions((
    {
        [fleetListActions.FLEET_LIST_START]: (state, action) => ({
            ...state,
            fleetData: action.payload.fleetData,
        }),
        [fleetListActions.FLEET_LIST_SUCCESS]: (state, action) => ({
            ...state,
            fleetData: action.payload.fleetData,
        }),
        [fleetListActions.FLEET_LIST_FAILED]: (state, action) => ({
            ...state,
            fleetData: action.payload.fleetData,
        }),
        [fleetAddActions.ADD_FLEET_SUCCESS]: (state, action) => ({
            ...state,
            fleetListData: {
                isSuccess: true,
                data: {},
            },
        }),
        [fleetEditAction.EDIT_FLEET_SUCCESS]: (state, action) => ({
            ...state,
            fleetListData: {
                ...state.fleetData,
                isEditSuccess: true,
            },
        }),
    }),
    initialAuthState
);