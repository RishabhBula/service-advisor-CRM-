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
  customerGetSuccess,
  customerGetFailed
} from "./../actions";

const addCustomerLogic = createLogic({
  type: customersAddActions.CUSTOMER_ADD_REQUEST,
  cancelType: customersAddActions.CUSTOMER_ADD_FAILED,
  async process({ getState, action }, dispatch, done) {
    const profileStateData = getState().profileInfoReducer;

    let data = action.payload;
    data.parentId = profileStateData.profileInfo.parentId;    
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
      dispatch(hideLoader());
      done();
    }
  }
});

const getCustomersLogic = createLogic({
  type: customersAddActions.CUSTOMER_GET_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      customerGetSuccess({
        isLoading: true,
        customers: [],
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer("/user", "/", "GET", true, {
      ...action.payload,
      limit: AppConfig.ITEMS_PER_PAGE,
    });
    if (result.isError) {
      dispatch(
        customerGetSuccess({
          isLoading: false,
          customers: [],
        })
      );
      done();
      return;
    } else {
      dispatch(hideLoader());
      dispatch(
        customerGetFailed({
          isLoading: false,
          customers: result.data.data,
          totalCustomers: result.data.totalCustomers,
        })
      );
      done();
    }
  },
});


export const CustomersLogic = [addCustomerLogic, getCustomersLogic];
