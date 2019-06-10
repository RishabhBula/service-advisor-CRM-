import { push } from "react-router-redux";
import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helpers/ApiHelper";
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
  vehicleEditSuccess,
  customerAddStarted,
  redirectTo,
  updateImportVehicleReq
} from "./../actions";
import { DefaultErrorMessage } from "../config/Constants";
import { AppRoutes } from "../config/AppRoutes";
import XLSX from "xlsx";
import { AppConfig } from "../config/AppConfig";

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
    dispatch(showLoader());
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
      dispatch(showLoader());
      dispatch(
        modelOpenRequest({
          modelDetails: {
            vehicleModel: false,
            custAndVehicleCustomer: false,
            custAndVehicleVehicle: false,
            custAndVehicle: false
          }
        })
      );
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
        search: action.payload && action.payload.input ? action.payload.input : action.payload && action.payload.search ? action.payload.search : null,
        sort: action.payload && action.payload.sort ? action.payload.sort : null,
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
      dispatch(hideLoader());
      done();
      return;
    } else {
      const options = result.data.data.map(vehicle => ({
        label: `${vehicle.make} ${vehicle.modal}`,
        value: vehicle._id,
        data: vehicle
      }));
      logger(action.payload && action.payload.callback ? action.payload.callback(options) : null)
      dispatch(hideLoader());
      dispatch(
        vehicleGetSuccess({
          isLoading: false,
          vehicleList: result.data.data,
          totalVehicles: result.data.totalVehicles
        })
      );
      dispatch(customerAddStarted({}));
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
      toast.error(result.messages[0] || DefaultErrorMessage);
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
      dispatch(modelOpenRequest({ modelDetails: { vehicleEditModel: false } }));
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
      "/delete",
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

const updateVehicleStatusLogic = createLogic({
  type: vehicleActions.UPDATE_VEHICLE_STATUS,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vehicle",
      "/updateStatus",
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
      dispatch(hideLoader());
      delete action.payload.vehicles;
      delete action.payload.status;
      dispatch(
        vehicleGetRequest({
          ...action.payload
        })
      );
      done();
    }
  }
});
const importVehicleLogic = createLogic({
  type: vehicleActions.IMPORT_VEHICLE_REQUEST,
  async process({ action, getState }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    if (!action.payload.length) {
      toast.error(`No data found in sheet.`);
      dispatch(hideLoader());
      done();
      return;
    }
    dispatch(
      updateImportVehicleReq({
        importError: null
      })
    );
    const profileStateData = getState().profileInfoReducer;
    logger(profileStateData);
    const errroredRows = [];
    let hasError = false;
    const data = action.payload.map(element => {
      if (!element["Year"]) {
        hasError = true;
        errroredRows.push(
          `Year not found on row <b>${element.rowNumber}</b> of <b>${
          element.sheetName
          }</b> sheet.`
        );
      } else if (
        isNaN(parseInt(element["Year"])) ||
        (element["Year"].length > 4 || element["Year"].length < 2)
      ) {
        hasError = true;
        errroredRows.push(
          `Invalid year value found on row <b>${element.rowNumber}</b> of <b>${
          element.sheetName
          }</b> sheet.`
        );
      }
      if (!element["Make"]) {
        hasError = true;
        errroredRows.push(
          `Make not found on row <b>${element.rowNumber}</b> of <b>${
          element.sheetName
          }</b> sheet.`
        );
      }
      if (!element["Model"]) {
        hasError = true;
        errroredRows.push(
          `Model number not found on row <b>${element.rowNumber}</b> of <b>${
          element.sheetName
          }</b> sheet.`
        );
      }
      return {
        year: parseInt(element["Year"]),
        make: element["Make"],
        modal: element["Model"],
        type: {
          value: element["Type"] ? element["Type"].toLowerCase() : null,
          label: element["Type"],
          color: "#00B8D9",
          isFixed: true
        },
        notes: element["Notes"],
        color: {
          color: element["Color"],
          label: element["Color"],
          value: element["Color"] ? element["Color"].toLowerCase() : null
        },
        miles: element["Miles"],
        licensePlate: element["Licence Plate"],
        unit: element["Unit #"],
        vin: element["VIN"],
        engineSize: element["Engine Size"],
        productionDate: element["Production Date"],
        transmission: element["Transmission"]
          ? element["Transmission"].toLowerCase()
          : null,
        subModal: element["Submodel"],
        drivetrain: element["Drivetrain"],
        parentId:
          profileStateData.profileInfo.parentId ||
          profileStateData.profileInfo._id,
        userId: profileStateData.profileInfo._id,
        status: true
      };
    });
    if (hasError) {
      dispatch(
        updateImportVehicleReq({
          importError: errroredRows.join(" <br /> ")
        })
      );
      dispatch(hideLoader());
      done();
      return;
    }
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/vehicle",
      "/bulk-add",
      "POST",
      true,
      undefined,
      data
    );
    if (!result.isError) {
      dispatch(
        modelOpenRequest({
          modelDetails: {
            showImportModal: false
          }
        })
      );
      dispatch(
        redirectTo({
          path: `${AppRoutes.VEHICLES.url}?page=1&reset=${Date.now()}`
        })
      );
      toast.success(result.messages[0]);
    } else {
      toast.error(result.messages[0] || DefaultErrorMessage);
    }
    setTimeout(
      () =>
        dispatch(
          updateImportVehicleReq({
            importError: null
          })
        ),
      8000
    );
    dispatch(hideLoader());
    done();
  }
});

/**
 *
 */
const getExportData = async (payload, data = []) => {
  let api = new ApiHelper();
  let result = await api.FetchFromServer(
    "/vehicle",
    "/getAllVehicleList",
    "GET",
    true,
    {
      ...payload,
      limit: 5001
    }
  );
  // Year	Make	Model	Submodel	Type	Miles	Color	Licence Plate	Unit #	VIN	Engine Size	Production Date	Transmission	Drivetrain	Notes

  if (!result.isError) {
    const d = result.data.data.map(res => {
      return {
        Year: res.year || "-",
        Make: res.make || "-",
        Model: res.modal || "-",
        Submodel: res.subModal || "-",
        Type: res.type.label || "-",
        Miles: res.miles || "-",
        Color: res.color.value || "-",
        "Licence Plate": res.licensePlate || "-",
        "Unit #": res.unit || "-",
        VIN: res.vin || "-",
        "Engine Size": res.engineSize || "-",
        "Production Date": res.productionDate || "-",
        Transmission: res.transmission || "-",
        Drivetrain: res.drivetrain || "-",
        Notes: res.notes || "-",
        Status: res.status ? "Active" : "Inactive"
      };
    });
    if (d.length === 5000) d.pop();
    data.push({
      name: `Vehicle List ${payload.page}`,
      data: d
    });
    if (result.data.data.length > 5000) {
      return await getExportData({ ...payload, page: payload.page + 1 }, data);
    }
  }
  return data;
};
/**
 *
 */
const exportVechicleLogic = createLogic({
  type: vehicleActions.EXPORT_VEHICLES,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    const result = await getExportData({ ...action.payload, page: 1 });
    logger(result);
    const wb = XLSX.utils.book_new();
    result.forEach(res => {
      const ws = XLSX.utils.json_to_sheet(res.data);
      XLSX.utils.book_append_sheet(wb, ws, `${res.name}`);
      /* generate XLSX file and send to client */
    });
    XLSX.writeFile(wb, `vehicles_${Date.now()}.xlsx`);
    dispatch(hideLoader());
    done();
  }
});
export const VehicleLogic = [
  vehicleAddLogic,
  getVehiclesLogic,
  editCustomerLogic,
  deleteVehicleLogic,
  updateVehicleStatusLogic,
  importVehicleLogic,
  exportVechicleLogic
];
