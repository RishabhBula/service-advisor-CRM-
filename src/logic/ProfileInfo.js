import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  profileInfoActions,
  profileInfoStarted,
  profileInfoFailed,
  profileInfoSuccess,
  redirectTo
} from "./../actions";

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
        profileInfoFailed({
          profileInfo: {},
          isLoading: false
        })
      );
      localStorage.removeItem("token");
      dispatch(
        redirectTo({
          path: "/login"
        })
      );
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

export const ProfileInfoLogic = [profileInfoLogic];
