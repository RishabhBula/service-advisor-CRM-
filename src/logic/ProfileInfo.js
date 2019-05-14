import { createLogic } from "redux-logic";

import { ApiHelper } from "../helpers/ApiHelper";

import {
  profileInfoActions,
  profileInfoStarted,
  profileInfoSuccess,
  updateCompanyLogoSuccess,
  showLoader,
  hideLoader,
  logOutRequest
} from "./../actions";
import { logger } from "../helpers/Logger";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";
/**
 *
 */
const profileInfoLogic = createLogic({
  type: profileInfoActions.PROFILE_INFO_REQUEST,
  cancelType: profileInfoActions.PROFILE_INFO_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    dispatch(
      profileInfoStarted({
        profileInfo: {},
        isLoading: true
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer("/user", "/getProfile", "GET", true);
    if (result.isError) {
      dispatch(logOutRequest());
      done();
      return;
    }
    const hostname = window.location.hostname.split(".");
    const subdomain = hostname[0];
    if (subdomain === result.data.data.subdomain) {
      dispatch(
        profileInfoSuccess({
          profileInfo: result.data.data,
          isLoading: false
        })
      );
      dispatch(hideLoader());
      done();
      return;
    }
    dispatch(logOutRequest());
    done();
  }
});
/**
 *
 */
const updateCompanyLogoLogic = createLogic({
  type: profileInfoActions.UPDATE_COMPANY_LOGO,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    const { payload } = action;
    logger(payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/image-upload",
      "POST",
      true,
      undefined,
      action.payload
    );
    logger(result);
    dispatch(hideLoader());
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      done();
      return;
    } else {
      dispatch(
        updateCompanyLogoSuccess({
          shopLogo: result.data.imageUploadData
        })
      );
      done();
    }
  }
});
/**
 *
 */
const updateCompanyDetailsLogic = createLogic({
  type: profileInfoActions.UPDATE_COMPANY_DETAILS,
  async process({ action, getState }, dispatch, done) {
    dispatch(showLoader());
    const { profileInfoReducer } = getState();
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/company-setup",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(
        profileInfoSuccess({
          isLoading: false,
          profileInfo: {
            ...profileInfoReducer.profileInfo,
            ...result.data.info
          }
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});
export const ProfileInfoLogic = [
  profileInfoLogic,
  updateCompanyLogoLogic,
  updateCompanyDetailsLogic
];
