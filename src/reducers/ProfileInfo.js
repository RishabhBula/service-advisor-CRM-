import { handleActions } from "redux-actions";
import { profileInfoActions } from "./../actions";

const initialAuthState = {
  profileInfo: {},
  isLoading: true,
};

export const profileInfoReducer = handleActions(
  {
    [profileInfoActions.PROFILE_INFO_START]: (state, action) => ({
      ...state,
      profileInfo: action.payload.profileInfo,
      isLoading: action.payload.isLoading,
    }),
    [profileInfoActions.PROFILE_INFO_SUCCESS]: (state, action) => ({
      ...state,
      profileInfo: action.payload.profileInfo,
      isLoading: action.payload.isLoading,
    }),
    [profileInfoActions.PROFILE_INFO_FAILED]: (state, action) => ({
      ...state,
      profileInfo: action.payload.profileInfo,
      isLoading: action.payload.isLoading,
    }),
  },
  initialAuthState
);
