import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  matrixActions,
  getMatrixListStart,
  getMatrixListFail,
  getMatrixListSuccess,
  showLoader,
  hideLoader,
  addMatrixSuccess,
  deleteMatrixSuccess,
  getMatrixList
} from "./../actions";
import { logger } from "../helpers/Logger";
import { toast } from "react-toastify";

const getMatrixLogic = createLogic({
  type: matrixActions.GET_MATRIX_LIST,
  cancelType: matrixActions.GET_MATRIX_LIST_FAILED,
  async process({ action, getState }, dispatch, done) {
    dispatch(
      getMatrixListStart({
        matrixList: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/matrix",
      "/getAllMatrix",
      "GET",
      true,
      { search: action.payload ? action.payload.input : null }
    );
    logger(result);
    if (result.isError) {
      dispatch(
        getMatrixListFail({
          matrixList: []
        })
      );
    }
    else {
      const options = result.data.data.map(matrix => ({
        label: matrix.matrixName,
        value: matrix._id
      }));
      logger(action.payload && action.payload.callback? action.payload.callback(options) : null)
      dispatch(
        getMatrixListSuccess({
          matrixList: result.data.data
        })
      );
    }
    done();

  }
});

const addPriceMatrixLogic = createLogic({
  type: matrixActions.ADD_MATRIX_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/matrix",
      "/addMatrix",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(addMatrixSuccess());
      dispatch(hideLoader());
      done();
    }
  }
});

const updateMatrixLogic = createLogic({
  type: matrixActions.UPDATE_MATRIX_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/matrix",
      "/updateMatrix",
      "PUT",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(
        getMatrixList({
          ...action.payload
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

const deleteMatrixLogic = createLogic({
  type: matrixActions.DELETE_MATRIX_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/matrix",
      "/delete",
      "DELETE",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      dispatch(deleteMatrixSuccess())
      delete action.payload.matrixId;
      dispatch(
        getMatrixList({
          ...action.payload
        })
      );
      done();
    }
  }
});


export const MatrixLogic = [
  getMatrixLogic,
  addPriceMatrixLogic,
  updateMatrixLogic,
  deleteMatrixLogic,
];
