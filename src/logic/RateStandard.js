import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import {
  rateStandardListActions,
  getRateStandardListStart,
  getRateStandardListFail,
  getRateStandardListSuccess,
  setRateStandardListStart,
  setRateStandardListSuccess
} from "./../actions";

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
        standardRateList: [],
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
          standardRateList: [],
        })
      );
    } else {
      var defaultOptions = [
        {
          value: '',
          label: 'Add New Customer',
        }
      ];
      let resultData = result.data.data;
      let dataNewArray = [];
      for (let i = 0; i < resultData.length; i++) {
        dataNewArray.push({ value: resultData[i]._id, label: resultData[i].name + " - " + resultData[i].hourlyRate })
      }
      
      dispatch(
        getRateStandardListSuccess({
          standardRateList: defaultOptions.concat(dataNewArray),
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

export const StandardRateLogic = [getStandardRateListLogic, setStandardRateListLogic];
