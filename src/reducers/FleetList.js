import { handleActions } from 'redux-actions';
import { fleetListActions } from "./../actions";

const initialAuthState = {
    fleetData: [],
};

export const fleetListReducer = handleActions((
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
        })
    }),
    initialAuthState
);