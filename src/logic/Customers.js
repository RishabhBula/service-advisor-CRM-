import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { AppConfig } from "../config/AppConfig";
import { logger } from "../helpers/Logger";
import {
  showLoader,
  hideLoader,
  customersAddActions,
  customerAddFailed,
  customerAddStarted,
  modelOpenRequest,
  customerGetStarted,
  customerGetSuccess,
  customerGetFailed,
  customerGetRequest,
  customerEditSuccess,
  customerAddSuccess,
  redirectTo
} from "./../actions";
import { DefaultErrorMessage } from "../config/Constants";
import { AppRoutes } from "../config/AppRoutes";

const addCustomerLogic = createLogic({
  type: customersAddActions.CUSTOMER_ADD_REQUEST,
  cancelType: customersAddActions.CUSTOMER_ADD_FAILED,
  async process({ getState, action }, dispatch, done) {
    const profileStateData = getState().profileInfoReducer;

    let data = action.payload;
    data.parentId = profileStateData.profileInfo.parentId;
    if (profileStateData.profileInfo.parentId === null) {
      data.parentId = profileStateData.profileInfo._id;
    }

    data.userId = profileStateData.profileInfo._id;
    dispatch(showLoader());
    logger(action.payload);
    dispatch(
      customerAddStarted({
        customerAddInfo: {}
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
      "/createCustomer",
      "POST",
      true,
      undefined,
      data
    );
    if (result.isError) {
      dispatch(
        customerAddFailed({
          customerAddInfo: {}
        })
      );

      toast.error(result.messages[0] || DefaultErrorMessage);

      dispatch(hideLoader());
      done();
      return;
    } else {
      if (!data.showAddVehicle) {
        toast.success(result.messages[0]);
      } else {
        dispatch(
          modelOpenRequest({
            modelDetails: {
              custAndVehicleCustomer: false,
              custAndVehicleVehicle: true
            }
          })
        );
      }
      dispatch(
        customerAddSuccess({
          customerAddInfo: result.data.data
        })
      );
      dispatch(modelOpenRequest({ modelDetails: { customerModel: false } }));
      dispatch(customerGetRequest());
      dispatch(hideLoader());
      done();
    }
  }
});

const getCustomersLogic = createLogic({
  type: customersAddActions.CUSTOMER_GET_REQUEST,
  cancelType: customersAddActions.CUSTOMER_GET_FAILED,
  async process({ action }, dispatch, done) {
    dispatch(
      customerGetStarted({
        isLoading: true,
        customers: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
      "/getAllCustomerList",
      "GET",
      true,
      {
        ...action.payload,
        limit: AppConfig.ITEMS_PER_PAGE
      }
    );
    if (result.isError) {
      dispatch(
        customerGetFailed({
          isLoading: false,
          customers: [],
          totalCustomers: 0
        })
      );
      done();
      return;
    } else {
      dispatch(hideLoader());
      dispatch(
        customerGetSuccess({
          isLoading: false,
          customers: result.data.data,
          totalCustomers: result.data.totalUsers
        })
      );
      done();
    }
  }
});

const deleteCustomerLogic = createLogic({
  type: customersAddActions.DELETE_CUSTOMER,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
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
        customerGetRequest({
          ...action.payload.query
        })
      );
      done();
    }
  }
});

const editCustomerLogic = createLogic({
  type: customersAddActions.EDIT_CUSTOMER_REQUESTED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
      "/updateCustomerdetails",
      "PUT",
      true,
      undefined,
      { data: action.payload.data }
    );
    if (result.isError) {
      toast.error(result.messages[0] || DefaultErrorMessage);
      dispatch(hideLoader());
      done();
      return;
    } else {
      if (!action.payload.showAddVehicle) {
        toast.success(result.messages[0]);
      } else {
        dispatch(
          modelOpenRequest({
            modelDetails: {
              custAndVehicleCustomer: false,
              custAndVehicleVehicle: true
            }
          })
        );
      }
      dispatch(customerEditSuccess());
      dispatch(
        customerGetRequest({
          ...action.payload.query
        })
      );
      dispatch(
        modelOpenRequest({
          modelDetails: { customerModel: false, customerEditModel: false }
        })
      );
      dispatch(hideLoader());
      done();
    }
  }
});

const updateCustomerStatusLogic = createLogic({
  type: customersAddActions.UPDATE_CUSTOMER_STATUS,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
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
      delete action.payload.customers;
      delete action.payload.status;
      dispatch(
        customerGetRequest({
          ...action.payload
        })
      );
      done();
    }
  }
});
const importCustomerLogic = createLogic({
  type: customersAddActions.IMPORT_CUSTOMER_REQUEST,
  async process({ action, getState }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    const profileStateData = getState().profileInfoReducer;
    logger(profileStateData);
    const errroredRows = [];
    let hasError = false;
    const data = action.payload.map((element, index) => {
      if (!element["First Name"]) {
        hasError = true;
        errroredRows.push(
          `First name not found on row ${element.rowNumber} of ${
            element.sheetName
          }`
        );
      }
      if (!element["Phone"]) {
        hasError = true;
        errroredRows.push(
          `Phone number not found on row ${element.rowNumber} of ${
            element.sheetName
          }`
        );
      }
      return {
        firstName: element["First Name"],
        lastName: element["Last Name"],
        phoneDetail: [
          { phone: element["Phone Type"], value: element["Phone"] }
        ],
        email: element["Email"],
        notes: element["Notes"],
        companyName: element["Company"],
        referralSource: element["Refral Source"],
        address1: element["Address"],
        city: element["City"],
        state: element["State"],
        zipCode: element["Zip Code"],
        permission: {
          isCorporateFleetTaxExempt: {
            status: element["Is Tax Exempt"]
              ? element["Is Tax Exempt"].toLowerCase() === "yes"
                ? true
                : false
              : false
          },
          shouldReceiveDiscount: {
            status: element["Is Receive A Discount?"]
              ? element["Is Receive A Discount?"].toLowerCase() === "yes"
                ? true
                : false
              : false
          },
          shouldLaborRateOverride: { status: false, laborRate: null },
          shouldPricingMatrixOverride: { status: false, pricingMatrix: null }
        },
        parentId:
          profileStateData.profileInfo.parentId ||
          profileStateData.profileInfo._id,
        userId: profileStateData.profileInfo._id,
        status: true
      };
    });
    if (hasError) {
      toast.error(errroredRows.join(" | "));
      dispatch(hideLoader());
      done();
      return;
    }
    const api = new ApiHelper();
    const result = await api.FetchFromServer(
      "/customer",
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
          path: `${AppRoutes.CUSTOMERS.url}?page=1&reset=true`
        })
      );
      toast.success(result.messages[0]);
    } else {
      toast.error(result.messages[0] || DefaultErrorMessage);
    }
    dispatch(hideLoader());
    done();
  }
});

export const CustomersLogic = [
  addCustomerLogic,
  getCustomersLogic,
  deleteCustomerLogic,
  editCustomerLogic,
  updateCustomerStatusLogic,
  importCustomerLogic
];
