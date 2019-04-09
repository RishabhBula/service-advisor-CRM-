import { handleActions } from 'redux-actions';
import { profileInfoActions } from "./../actions";

const initialAuthState = {
    profileInfo: [],
};

export const profileInfoReducer = handleActions((
    {
        [profileInfoActions.PROFILE_INFO_START]: (state, action) => ({
            ...state,
            profileInfo: action.payload.profileInfo,
        }), 
        [profileInfoActions.PROFILE_INFO_SUCCESS]: (state, action) => ({
            ...state,
            profileInfo: action.payload.profileInfo,
        }),
        [profileInfoActions.PROFILE_INFO_FAILED]: (state, action) => ({
            ...state,
            profileInfo: action.payload.profileInfo,
        })
    }),
    initialAuthState
);