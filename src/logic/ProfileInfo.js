import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  profileInfoActions,
  profileInfoStarted,
  profileInfoSuccess,
  redirectTo,
  updateCompanyLogoSuccess,
  updatePasswordSuccess,
  profileInfoRequest,
  updatePasswordFailed,
  profileSettingUpdateSuccess,
  profileSettingUpdateFailed,
  showLoader,
  hideLoader
} from "./../actions";
import { logger } from "../helpers/Logger";
import { toast } from "react-toastify";
import { DefaultErrorMessage } from "../config/Constants";

const profileInfoLogic = createLogic({
  type: profileInfoActions.PROFILE_INFO_REQUEST,
  cancelType: profileInfoActions.PROFILE_INFO_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      profileInfoStarted({
        profileInfo: {},
        isLoading: true
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer("/user", "/getProfile", "GET", true);
    if (result.isError) {
      dispatch(
        redirectTo({
          path: "/login"
        })
      );
      localStorage.removeItem("token");
      done();
      return;
    } else {
      dispatch(
        profileInfoSuccess({
          profileInfo: result.data.data,
          isLoading: false
        })
      );
      done();
    }
  }
});

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
      // toast.success(result.messages[0]);
      dispatch(
        updateCompanyLogoSuccess({
          shopLogo: result.data.imageUploadData
        })
      );
      done();
    }
  }
});

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
      dispatch(profileInfoRequest());
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

const updatePasswordLogic = createLogic({
  type: profileInfoActions.UPDATE_PASSWORD_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    // dispatch(updatePasswordRequest())
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/change-password",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      dispatch(updatePasswordFailed())
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      dispatch(updatePasswordSuccess());
      done();
    }
  }
})

const profileSettingUpdate = createLogic({
  type: profileInfoActions.PROFILE_SETTING_UPDATE_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    // dispatch(updatePasswordRequest())
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/auth",
      "/update-user",
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      dispatch(profileSettingUpdateFailed())
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      dispatch(
        profileSettingUpdateSuccess({
          profileInfo: result.data.data,
          isLoading: false
        })
        );
      console.log(result.data.data, "result.data.data")
      }
    done();
  }
})

export const ProfileInfoLogic = [
  profileInfoLogic,
  updateCompanyLogoLogic,
  updateCompanyDetailsLogic,
  updatePasswordLogic,
  profileSettingUpdate
];
