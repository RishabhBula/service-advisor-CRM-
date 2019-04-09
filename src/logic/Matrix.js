import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
  matrixActions,
  getMatrixList,
  getMatrixListStart,
  getMatrixListFail,
  getMatrixListSuccess
} from "./../actions";

const getMatrixLogic = createLogic({
  type: matrixActions.GET_MATRIX_LIST,
  cancelType: matrixActions.GET_MATRIX_LIST_FAILED,
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
    if(result.isError) {
        dispatch(
          getMatrixListFail({
            matrixList: []
          })
        );
    }
    else {
        dispatch(
          getMatrixListSuccess({
            matrixList: result.data.data
          })
        );
    }
    done();
   
  }
});


export const MatrixLogic = [getMatrixLogic];
