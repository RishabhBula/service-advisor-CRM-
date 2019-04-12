import { handleActions } from 'redux-actions';
import { modelActions } from "./../actions";

const initialAuthState = {
    modelDetails: {
        "customerModel": false,
        "customreEditModel": false
    }
};

export const modelInfoReducer = handleActions((
    {
        [modelActions.MODEL_OPEN_REQUEST]: (state, action) => ({
            ...state,
            modelDetails: action.payload.modelDetails,
        }), 
        [modelActions.MODEL_CLOSE_REQUEST]: (state, action) => ({
            ...state,
            modelDetails: action.payload.modelDetails,
        })
    }),
    initialAuthState
);