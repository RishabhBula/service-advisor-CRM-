import { createLogic } from "redux-logic";
import {
  labourAddStarted,
  labourActions,
  labourAddSuccess,
  modelOpenRequest,
  hideLoader,
  showLoader,
  labourListStarted,
  labourListSuccess,
  labourListRequest,
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { logger } from "../helpers/Logger";
import { AppConfig } from "../config/AppConfig";

const labourAddLogic = createLogic({
  type: labourActions.LABOUR_ADD_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      labourAddStarted({
        labourData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/addlabour",
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
      dispatch(hideLoader());
      dispatch(modelOpenRequest({modelDetails: {tireAddModalOpen: false}})); 
      dispatch(labourListRequest({
        ...action.payload,
      }));
      dispatch(labourAddSuccess( {labourData: result.data}));
      done();
    }
  }
});

const labourListLogic = createLogic({
  type: labourActions.LABOUR_LIST_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      labourListStarted({
        labourData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/labourList",
      "GET",
      true,
      {
        ...action.payload,
        limit: AppConfig.ITEMS_PER_PAGE,
      },
      undefined,
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(
        labourListSuccess({
          labourData: result.data
        }),
        hideLoader(),
      );
      done();
    }
  }
});

const editLabourLogic = createLogic({
  type: labourActions.EDIT_LABOUR_REQUESTED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/updateLabour",
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
      dispatch(hideLoader());
      dispatch(
        modelOpenRequest({modelDetails: {tireEditModalOpen: false}})        
      )    
      dispatch(labourListRequest({
        ...action.payload,
      }));
      done();
    }
  },
});

const deleteLabourLogic = createLogic({
  type: labourActions.DELETE_LABOUR,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/delete",
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
      dispatch(hideLoader());
      delete action.payload.labourId;
      dispatch(
        labourListRequest({
          ...action.payload,
        })
      );
      done();
    }
  },
});
export const LaboursLogic = [
  labourAddLogic,
  labourListLogic,
  editLabourLogic,
  deleteLabourLogic
];
