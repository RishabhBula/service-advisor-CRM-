import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
   showLoader,
   hideLoader,
   labelAction,
   addLabelSuccess,
   getLabelListSuccess,
   getLabelList,
} from "./../actions";

const addLabelLogic = createLogic({
   type: labelAction.ADD_LABEL,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/label",
         "/addNewLabel",
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
         dispatch(addLabelSuccess());
         dispatch(getLabelList());
         dispatch(hideLoader());
         done();
      }
   }
});

const getLabelLogic = createLogic({
   type: labelAction.GET_LABEL_LIST,
   async process({ action }, dispatch, done) {
      dispatch(
         getLabelListSuccess({
            isLoading: true,
            label: []
         })
      );
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/label",
         "/getLabel",
         "GET",
         true,
         {
            "isSavedLabel": true
         }
      );
      if (result.isError) {
         dispatch(
            getLabelListSuccess({
               isLoading: false,
               label: []
            })
         );
         done();
         return;
      } else {
         dispatch(hideLoader());
         dispatch(
            getLabelListSuccess({
               isLoading: false,
               label: result.data.data,
            })
         );
         done();
      }
   }
});

export const LabelLogic = [
   addLabelLogic,
   getLabelLogic
];