import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
  showLoader,
  hideLoader,
  modelActions
} from "./../actions";

const modelOperation = createLogic({
  type: modelActions.MODEL_OPEN_REQUEST,
  cancelType: modelActions.MODEL_CLOSE_REQUEST,
  async process({ getState, action }, dispatch, done) {
    const modelStateData = getState().modelInfoReducer;

    let modelDetails = action.payload;
  console.log('=================detail===================');
  console.log('====================================');
  console.log(modelStateData);
  console.log('====================================');
  console.log(modelDetails);
  console.log('====================================');
    // dispatch(
    //   customerAddStarted({
    //     customerAddInfo: []
    //   })
    // );
    
      done();
      return;
   
  }
});
export const ModelOperationLogic = [modelOperation];
