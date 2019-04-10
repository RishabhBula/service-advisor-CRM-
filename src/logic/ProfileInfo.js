import { createLogic } from "redux-logic";
import {
  profileInfoActions,
  profileInfoStarted,
  profileInfoFailed,
  profileInfoSuccess
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { push } from "react-router-redux";

const profileInfoLogic = createLogic({
  type: profileInfoActions.PROFILE_INFO_REQUEST,
  cancelType: profileInfoActions.PROFILE_INFO_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      profileInfoStarted({
        profileInfo: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "user/getProfile",
      "GET",
      true,
      undefined
    );
    if (result.isError) {
      dispatch(
        profileInfoFailed({
          profileInfo: []
        })
      );
      localStorage.removeItem("token");
      dispatch(push("/login"));
      done();
      return;
    } else {
      dispatch(
        profileInfoSuccess({
          profileInfo: result.data.data
        })
      );
      done();
    }
  }
});

export const ProfileInfoLogic = [profileInfoLogic];