import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { toast } from "react-toastify";
import {
  rateStandardListActions,
  getRateStandardListStart,
  getRateStandardListFail,
  getRateStandardListSuccess,
  rateAddStarted,
  hideLoader,
  showLoader,
  rateAddSuccess,
  modelOpenRequest,
  setRateStandardListStart
} from "./../actions";
 
const rateAddLogic = createLogic({
  type: rateStandardListActions.RATE_ADD_REQUEST,
  async process({ action }, dispatch, done) {
    dispatch(
      rateAddStarted({
        rateData: []
      }),
      showLoader()
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/addRate",
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
      dispatch(modelOpenRequest({modelDetails: {rateAddModalOpen: false}})); 
      
      dispatch(
        setRateStandardListStart({
          value: result.data.data._id,
          label: result.data.data.name + " - " + result.data.data.hourlyRate
        })
      );
      dispatch(rateAddSuccess( {rateData: result.data}));
      done();
    }
  }
});


const getStandardRateListLogic = createLogic({
  type: rateStandardListActions.GET_RATE_STANDARD_LIST_REQUEST,
  cancelType: rateStandardListActions.GET_RATE_STANDARD_LIST_FAILED,
  async process({ action, getState }, dispatch, done) {
    const profileStateData = getState().profileInfoReducer;

    let parentId = profileStateData.profileInfo.parentId;
    if (profileStateData.profileInfo.parentId === null) {
      parentId = profileStateData.profileInfo._id;
    }
    let data = {
      parentId: parentId,
      searchValue: action.payload
    };
    dispatch(
      getRateStandardListStart({
        standardRateList: []
      })
    );
    let api = new ApiHelper();
    let result = await api.FetchFromServer(
      "/labour",
      "/getAllStdRate",
      "get",
      true,
      data,
      undefined
    );
    if (result.isError) {
      dispatch(
        getRateStandardListFail({
          standardRateList: []
        })
      );
    } else {
      var defaultOptions = [
        {
          value: "",
          label: "Add New Labour Rate"
        }
      ];      
      let resultData = result.data.data;
      let dataNewArray = [];
      for (let i = 0; i < resultData.length; i++) {
        dataNewArray.push({
          value: resultData[i]._id,
          label: resultData[i].name + " - " + resultData[i].hourlyRate
        });
      }

      dispatch(
        getRateStandardListSuccess({
          standardRateList: defaultOptions.concat(dataNewArray)
        })
      );
    }
    done();
  }
});

const setStandardRateListLogic = createLogic({
  type: rateStandardListActions.SET_SELECTED_STANDARD_LIST_REQUEST,
  async process({ action, getState }, dispatch, done) {
    const rateStandardData = getState().rateStandardListReducer;
    dispatch(
      getRateStandardListSuccess({
        standardRateList: rateStandardData.standardRateList,
        selectedOptions: action.payload
      })
    );
    done();
  }
});

export const StandardRateLogic = [
  getStandardRateListLogic,
  setStandardRateListLogic,
  rateAddLogic
];
