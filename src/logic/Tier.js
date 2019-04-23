import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import { AppConfig } from "../config/AppConfig";
import {
   showLoader,
   hideLoader,
   tiersActions,
   modelOpenRequest,
   addTierSuccess,
   getTiersListSuccess,
   getTiersList
} from "./../actions";

const addTireLogic = createLogic({
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
                  tireAddModalOpen: false
               }
            })
         );
         dispatch(addTierSuccess());
         dispatch(hideLoader());
         done();
      }
   }
});

const getTiresLogic = createLogic({
   type: tiersActions.GET_TIER_LIST,
   async process({ action }, dispatch, done) {
      dispatch(
         getTiersListSuccess({
            isLoading: true,
            tires: []
         })
      );
      let api = new ApiHelper();
      let result = await api.FetchFromServer("/tier", "/tierList", "GET", true, {
         ...action.payload,
         limit: AppConfig.ITEMS_PER_PAGE
      });
      if (result.isError) {
         dispatch(
            getTiersListSuccess({
               isLoading: false,
               tires: []
            })
         );
         done();
         return;
      } else {
         dispatch(hideLoader());
         dispatch(
            getTiersListSuccess({
               isLoading: false,
               tires: result.data.data,
               totalTires: result.data.totalTier
            })
         );
         done();
      }
   }
});

const updateUserStatusLogic = createLogic({
   type: tiersActions.UPDATE_TIER_STATUS,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/tier",
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
         dispatch(hideLoader());
         delete action.payload.tires;
         delete action.payload.status;
         dispatch(
            getTiersList({
               ...action.payload
            })
         );

         toast.success(result.messages[0]);
         done();
      }
   }
});

const deleteTireLogic = createLogic({
   type: tiersActions.DELETE_TIER,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/tier",
         "/delete",
         "DELETE",
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
         delete action.payload.tireId;
         dispatch(
            getTiersList({
               ...action.payload
            })
         );
         done();
      }
   }
});

const editTiresLogic = createLogic({
   type: tiersActions.EDIT_TIER,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/tier",
         "/updateTier",
         "PUT",
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
            getTiersList({
               ...action.payload
            })
         );
         dispatch(
            modelOpenRequest({
               modelDetails: {
                  tireEditModalOpen: false
               }
            })
         );
         dispatch(hideLoader());
         done();
      }
   }
});

export const TiersLogic = [
   addTireLogic,
   getTiresLogic,
   updateUserStatusLogic,
   deleteTireLogic,
   editTiresLogic
];