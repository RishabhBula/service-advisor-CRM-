import { handleActions } from "redux-actions";
import { profileInfoActions } from "./../actions";

const initialAuthState = {
  profileInfo: {},
  isLoading: true,
  companyLogoUpdated: true
};

export const profileInfoReducer = handleActions(
  {
    [profileInfoActions.PROFILE_INFO_START]: (state, action) => ({
      ...state,
      profileInfo: action.payload.profileInfo,
      isLoading: action.payload.isLoading
    }),
    [profileInfoActions.PROFILE_INFO_SUCCESS]: (state, action) => ({
      ...state,
      profileInfo: action.payload.profileInfo,
      isLoading: action.payload.isLoading
    }),
    [profileInfoActions.PROFILE_INFO_FAILED]: (state, action) => ({
      ...state,
      profileInfo: action.payload.profileInfo,
      isLoading: action.payload.isLoading
    }),
    [profileInfoActions.UPDATE_COMPANY_LOGO]: (state, action) => ({
      ...state,
      companyLogoUpdated: false
    }),
    [profileInfoActions.UPDATE_COMPANY_LOGO_SUCCESS]: (state, action) => ({
      ...state,
      profileInfo: {
        ...state.profileInfo,
        shopLogo: action.payload.shopLogo
      },
      companyLogoUpdated: true
    })
  },
  initialAuthState
);
