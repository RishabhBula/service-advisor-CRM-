import { createAction } from "redux-actions";

export const profileInfoActions = {
  PROFILE_INFO_REQUEST: "ProfileInfo Requested!",
  PROFILE_INFO_SUCCESS: "ProfileInfo successfully!",
  PROFILE_INFO_FAILED: "ProfileInfo failed!",
  PROFILE_INFO_START: "ProfileInfo Started!",
  UPDATE_COMPANY_LOGO: "Request company logo update!",
  UPDATE_COMPANY_LOGO_SUCCESS: "Request company logo update success!",
  UPDATE_COMPANY_DETAILS: "Request company details update!"
};

export const profileInfoRequest = createAction(
  profileInfoActions.PROFILE_INFO_REQUEST 
);
export const profileInfoStarted = createAction(
  profileInfoActions.PROFILE_INFO_START
);
export const profileInfoSuccess = createAction(
  profileInfoActions.PROFILE_INFO_SUCCESS
);
export const profileInfoFailed = createAction(
  profileInfoActions.PROFILE_INFO_FAILED
);
export const updateCompanyLogo = createAction(
  profileInfoActions.UPDATE_COMPANY_LOGO
);
export const updateCompanyLogoSuccess = createAction(
  profileInfoActions.UPDATE_COMPANY_LOGO_SUCCESS
);
export const updateCompanyDetails = createAction(
  profileInfoActions.UPDATE_COMPANY_DETAILS
);
