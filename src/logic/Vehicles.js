import { push } from "react-router-redux";
import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helpers/ApiHelper";
import { AppConfig } from "../config/AppConfig";
import { logger } from "../helpers/Logger";
import {
  showLoader,
  hideLoader,
  vehicleActions,
  vehicleAddStarted,
  vehicleAddSuccess,
  vehicleAddFailed,
  modelOpenRequest,
  vehicleGetStarted,
  vehicleGetSuccess,
  vehicleGetFailed,
  vehicleGetRequest,
  vehicleEditSuccess
} from "./../actions";

const vehicleAddLogic = createLogic({
  type: vehicleActions.VEHICLES_ADD_REQUEST,
  cancelType: vehicleActions.VEHICLES_ADD_FAILED,
  async process({ getState, action }, dispatch, done) {
    const profileStateData = getState().profileInfoReducer;
    let data = action.payload;
    data.parentId = profileStateData.profileInfo.parentId;
    data.userId = profileStateData.profileInfo._id;
    if (profileStateData.profileInfo.parentId === null) {
      data.parentId = profileStateData.profileInfo._id;
    }
    dispatch(
      vehicleAddStarted({
        vehicleAddInfo: [],
        isLoading: true
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      "/addVehicle",
      "POST",
      true,
      undefined,
      action.payload
    );
    if (result.isError) {
      dispatch(
        vehicleAddFailed({
          vehicleAddInfo: [],
          isLoading: false
        })
      );
      localStorage.removeItem("token");
      dispatch(push("/login"));
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(
        vehicleAddSuccess({
          vehicleAddInfo: result.data.data,
          isLoading: false
        })
      );
      dispatch(modelOpenRequest({ modelDetails: { vehicleModel: false } }));
      dispatch(vehicleGetRequest());
      done();
    }
  }
});

const getVehiclesLogic = createLogic({
  type: vehicleActions.VEHICLES_GET_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      vehicleGetStarted({
        isLoading: true,
        vehicleList: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      "/getAllVehicleList",
      "GET",
      true,
      {
        ...action.payload,
        limit: AppConfig.ITEMS_PER_PAGE
      }
    );
    if (result.isError) {
      dispatch(
        vehicleGetFailed({
          isLoading: false,
          vehicleList: []
        })
      );
      done();
      return;
    } else {
      dispatch(hideLoader());
      dispatch(
        vehicleGetSuccess({
          isLoading: false,
          vehicleList: result.data.data,
          totalVehicles: result.data.totalVehicles
        })
      );
      done();
    }
  }
});

const editCustomerLogic = createLogic({
  type: vehicleActions.EDIT_VEHICLE_REQUESTED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let data = {
      data: action.payload
    };
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      "/updateVehicleDetails",
      "PUT",
      true,
      undefined,
      data
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(vehicleEditSuccess());
      dispatch(
        vehicleGetRequest({
          ...action.payload
        })
      );
      dispatch(
        modelOpenRequest({ modelDetails: { vehicleEditModel: false } })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

const deleteVehicleLogic = createLogic({
  type: vehicleActions.DELETE_VEHICLE,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      ["/deleteVehicle/", action.payload.vehicleId].join(""),
      "DELETE",
      true
    );
    if (result.isError) {
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(hideLoader());
      delete action.payload.userId;
      dispatch(
        vehicleGetRequest({
          ...action.payload
        })
      );
      done();
    }
  }
});

export const VehicleLogic = [
         vehicleAddLogic,
         getVehiclesLogic,
         editCustomerLogic,
         deleteVehicleLogic
       ];
