import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import {
   showLoader,
   hideLoader,
   serviceActions,
   addServiceSuccess,
   getCannedServiceListSuccess,
   getCannedServiceList
} from "./../actions";

const addServiceLogic = createLogic({
   type: serviceActions.ADD_SERVICE,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/service",
         "/addService",
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
         let serviceIds = []
         result.data.serviceResultData.map((service, index) => {
            serviceIds.push(service._id)
            return true
         })
         dispatch(addServiceSuccess(
            {
               serviceIds: serviceIds,
               customerCommentId: result.data.commentResult._id,
               services: result.data.serviceResultData
            }
         ));
         dispatch(getCannedServiceList())
         dispatch(hideLoader());
         done();
      }
   }
});

const getCannedServiceLogic = createLogic({
   type: serviceActions.GET_CANNED_SERVICE_LIST,
   async process({ action }, dispatch, done) {
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/service",
         "/cannedServiceList",
         "GET",
         true,
         {
            search: action.payload && action.payload.input ? action.payload.input : action.payload && action.payload.search ? action.payload.search : null,
         }
      );
      if (result.isError) {
         toast.error(result.messages[0]);
         dispatch(getCannedServiceListSuccess(
            {
               cannedServiceList: [],
               isLoading: false
            }
         ))
         done();
         return;
      } else {
         var defaultOptions = [
            {
               value: "",
               label: "+ Add New Canned Service"
            }
         ];
         const options = result.data.data.map(service => ({
            label: service.serviceName,
            value: service._id,
            serviceData: service
         }));
         logger(action.payload && action.payload.callback ? action.payload.callback(defaultOptions.concat(options)) : null)
         dispatch(hideLoader());
         dispatch(getCannedServiceListSuccess(
            {
               cannedServiceList: result.data.data,
               isLoading: false
            }
         ))
         done();
      }
   }
})

export const ServiceLogic = [
   addServiceLogic,
   getCannedServiceLogic
];