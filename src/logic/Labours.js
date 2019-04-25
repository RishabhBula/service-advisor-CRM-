import { createLogic } from "redux-logic";
import {
  labourAddStarted,
  labourAddActions,
  labourAddSuccess,
  modelOpenRequest,
  hideLoader,
  showLoader,
  labourListActions,
  labourListStarted,
  labourListSuccess,
  labourEditSuccess,
  labourEditAction,
  labourDeleteActions,
  labourListRequest,
} from "./../actions";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import { logger } from "../helpers/Logger";
import { AppConfig } from "../config/AppConfig";

const labourAddLogic = createLogic({
  type: labourAddActions.LABOUR_ADD_REQUEST,
  cancelType: labourAddActions.LABOUR_ADD_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      labourAddStarted({
        fleetData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "labour/addlabour",
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
      dispatch(
        modelOpenRequest({modelDetails: {typeAddModalOpen: false}})
      );
      dispatch(labourAddSuccess());
      dispatch(
        labourListRequest({
          ...action.payload,
        })
      )
     
      done();
    }
  }
});

const labourListLogic = createLogic({
  type: labourListActions.LABOUR_LIST_REQUEST,
  cancelType: labourListActions.LABOUR_LIST_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      labourListStarted({
        labourData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "labour/labourList",
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
  type: labourEditAction.EDIT_LABOUR_REQUESTED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "labour/updateLabour",
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
      dispatch(hideLoader())
      dispatch(labourEditSuccess({
        ...action.payload
      }),
      );
      dispatch(
        labourListRequest({
          ...action.payload,
        })
      )
      done();
    }
  },
});

const deleteLabourLogic = createLogic({
  type: labourDeleteActions.DELETE_LABOUR,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/",
      "labour/delete",
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

// const updateLabourStatusLogic = createLogic({
// //   type: labourUpdateStatusAction.UPDATE_LABOUR_STATUS,
// //   async process({ action }, dispatch, done) {
// //     dispatch(showLoader());
// //     logger(action.payload);
// //     let api = new ApiHelper();
// //     let result = await api.FetchFromServer(
// //       "/fleet",
// //       "/updateStatus",
// //       "POST",
// //       true,
// //       undefined,
// //       action.payload
// //     );
// //     if (result.isError) {
// //       toast.error(result.messages[0]);
// //       dispatch(hideLoader());
// //       done();
// //       return;
// //     } else {
// //       toast.success(result.messages[0]);
// //       dispatch(hideLoader());
// //       delete action.payload.fleets;
// //       delete action.payload.status;
// //       dispatch(
// //         labourListRequest({
// //           ...action.payload
// //         })
// //       );
// //       done();
// //     }
// //   }
// });


export const LaboursLogic = [
  labourAddLogic,
  labourListLogic,
  editLabourLogic,
  deleteLabourLogic,

];
