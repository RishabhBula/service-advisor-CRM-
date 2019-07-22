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
   getCannedServiceList,
   updateOrderDetailsRequest
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
         if (result.messages[0] !== '') {
            toast.success(result.messages[0]);
         }
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
         if (serviceIds.length) {
            let serviceIdData = []
            serviceIds.map((item, index) => {
               const serviceId =
               {
                  serviceId: item
               }
               serviceIdData.push(serviceId)
               return true
            })

            if (!action.payload.thisIsCannedService) {
               const payload = {
                  serviceId: serviceIdData,
                  _id: action.payload.orderId,
                  customerCommentId: result.data.commentResult ? result.data.commentResult._id : null
               }
               dispatch(updateOrderDetailsRequest(payload))
            }
         }
         dispatch(getCannedServiceList())
         dispatch(hideLoader());
         done();
      }
   }
});

const getCannedServiceLogic = createLogic({
   type: serviceActions.GET_CANNED_SERVICE_LIST,
   async process({ action }, dispatch, done) {
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/service",
         "/cannedServiceList",
         "GET",
         true,
         {
            search: action.payload && action.payload.input ? action.payload.input : action.payload && action.payload.search ? action.payload.search : null,
            serviceId: action.payload && action.payload.serviceId ? action.payload.serviceId : null,
         }
      );
      if (result.isError) {
         toast.error(result.messages[0]);
         dispatch(getCannedServiceListSuccess(
            {
               cannedServiceList: [],
            }
         ))
         done();
         return;
      } else {
         const options = result.data.data.map(service => ({
            label: service.serviceName,
            value: service._id,
            serviceData: service
         }));
         logger(action.payload && action.payload.callback ? action.payload.callback(options) : null)
         dispatch(getCannedServiceListSuccess(
            {
               cannedServiceList: result.data.data,
            }
         ))
         done();
      }
   }
})

const addCannedServiceLogic = createLogic({
   type: serviceActions.ADD_CANNED_SERVICE,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/service",
         "/addCanned",
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
         if (result.messages[0] !== '') {
            toast.success(result.messages[0]);
         }
         dispatch(getCannedServiceList())
         dispatch(hideLoader());
         done();
      }
   }
});

const deleteCannedServiceLogic = createLogic({
   type: serviceActions.DELETE_CANNED_SERVICE_REQUEST,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/service",
         "/updateCanned",
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
         dispatch(getCannedServiceList())
         dispatch(hideLoader());
         done();
      }
   }
});

export const ServiceLogic = [
   addServiceLogic,
   getCannedServiceLogic,
   addCannedServiceLogic,
   deleteCannedServiceLogic
];