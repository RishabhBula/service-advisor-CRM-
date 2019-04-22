import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { 
  addVendorSuccess,
  showLoader,
  hideLoader,
  modelOpenRequest,
  vendorActions,
} from "../actions"

const addVendorsLogic = createLogic({
  type: vendorActions.ADD_VENDOR,
  async process({ action }, dispatch, done) {
    dispatch(showLoader());
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/vendor",
      "/addVendor",
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
      dispatch(
        modelOpenRequest({
          modelDetails: {
            vendorAddModalOpen: false
          }
        })
      );
      dispatch(addVendorSuccess());
      dispatch(hideLoader());
      done();
    }
  }
});

export const VendorLogic = [
  addVendorsLogic
];
