import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
   showLoader,
   hideLoader,
   tiersActions,
   modelOpenRequest,
   addTierSuccess
} from "./../actions";

const addTierLogic = createLogic({
   type: tiersActions.ADD_TIER,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/tier",
         "/addTier",
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
                  typeAddModalOpen: false
               }
            })
         );
         dispatch(addTierSuccess());
         dispatch(hideLoader());
         done();
      }
   }
});

export const TiersLogic = [
   addTierLogic,
];