import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  rateStandardListActions,
  getMatrixListStart,
  getMatrixListFail,
  getMatrixListSuccess
} from "./../actions";

const getStandardRateListLogic = createLogic({
  type: rateStandardListActions.GET_RATE_STANDARD_LIST_REQUEST,
  cancelType: rateStandardListActions.GET_RATE_STANDARD_LIST_FAILED,
  async process({ action, getState }, dispatch, done) {
    const profileStateData = getState().profileInfoReducer;

    let parentId = profileStateData.profileInfo.parentId;
    if (profileStateData.profileInfo.parentId === null) {
      parentId = profileStateData.profileInfo._id;
    }
    let data = {
      parentId: parentId
    };
    dispatch(
      getMatrixListStart({
        matrixList: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/matrix",
      "/getAllMatrix",
      "POST",
      true,
      undefined,
      data
    );
    if (result.isError) {
      dispatch(
        getMatrixListFail({
          matrixList: []
        })
      );
    } else {
      dispatch(
        getMatrixListSuccess({
          matrixList: result.data.data
        })
      );
    }
    done();
  }
});

export const StandardRateLogic = [getStandardRateListLogic];
