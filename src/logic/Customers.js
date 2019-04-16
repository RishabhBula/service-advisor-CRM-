import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { AppConfig } from "../config/AppConfig";
import { logger } from "../helpers/Logger";
import {
  showLoader,
  hideLoader,
  customersAddActions,
  customerAddSuccess,
  customerAddFailed,
  customerAddStarted,
  modelOpenRequest,
  customerGetStarted,
  customerGetSuccess,
  customerGetFailed,
  customerGetRequest,
  customerEditSuccess
} from "./../actions";

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
        customerAddInfo: []
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
            customerAddInfo: []
          })
        );
      toast.error(result.messages[0]);
      dispatch(hideLoader());
      done();
      return;
    } else {
      toast.success(result.messages[0]);
      dispatch(
        customerAddSuccess({
          customerAddInfo: result.data.data
        })
      );
      dispatch(
        modelOpenRequest({modelDetails: {customerModel: false}})
      );
       dispatch(
        customerGetRequest()
      );
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
        customers: [],
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer", 
      "/getAllCustomerList", 
      "GET", true, {
      ...action.payload,
      limit: AppConfig.ITEMS_PER_PAGE,
    });
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
          totalCustomers: result.data.totalUsers,
        })
      );
      done();
    }
  },
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
      'POST',
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
      delete action.payload.userId;
      dispatch(
        customerGetRequest({
          ...action.payload.query,
        })
      );      
      done();
    }
  },
});

const editCustomerLogic = createLogic({
  type: customersAddActions.EDIT_CUSTOMER_REQUESTED,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    logger(action.payload);
    let data = {
      data: action.payload.data
    }
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/customer",
      "/updateCustomerdetails",
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
      dispatch(customerEditSuccess());
      dispatch(
        customerGetRequest({
          ...action.payload.query,
        })
      );   
      dispatch(
        modelOpenRequest({modelDetails: {customerModel: false}})
      );
      dispatch(hideLoader());
      done();
    }
  },
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
      toast.error(result.messages[0]);
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

export const CustomersLogic = [addCustomerLogic, getCustomersLogic, deleteCustomerLogic, editCustomerLogic, updateCustomerStatusLogic];
