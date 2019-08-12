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
   updateOrderDetailsRequest,
   getAllServiceListSuccess,
   genrateInvoice
} from "./../actions";

const addServiceLogic = createLogic({
   type: serviceActions.ADD_SERVICE,
   async process({ action }, dispatch, done) {
      //dispatch(showLoader());
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
         //dispatch(hideLoader());
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
                  remainingAmount: action.payload.orderTotal,
                  orderTotal: action.payload.orderTotal,
                  _id: action.payload.orderId,
                  customerCommentId: result.data.commentResult ? result.data.commentResult._id : null
               }
               dispatch(
                  genrateInvoice({
                     html: action.payload.html,
                     _id: action.payload.orderId
                  })
               );
               dispatch(updateOrderDetailsRequest(payload))
            }
         }
         dispatch(getCannedServiceList())
         //dispatch(hideLoader());
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

const deleteServiceLogic = createLogic({
   type: serviceActions.DELETE_SERVICE,
   async process({ action }, dispatch, done) {
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/service",
         "/updateService",
         "PUT",
         true,
         undefined,
         action.payload
      );
      if (result.isError) {
         toast.error(result.messages[0]);
         done();
         return;
      } else {
         done();
      }
   }
});

const getAllServiceLogic = createLogic({
   type: serviceActions.GET_ALL_SERVICE_LIST_REQUEST,
   async process({ action }, dispatch, done) {
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/service",
         "/serviceData",
         "Get",
         true,
         {
            technicianId: action.payload && action.payload.technicianId ? action.payload.technicianId : null
         }
      );
      if (result.isError) {
         toast.error(result.messages[0]);
         done();
         return;
      } else {
         let orderArray = []
         if (result.data.data.length) {
            result.data.data.map((element) => {
               if (element.orderId) {
                  if (orderArray && orderArray.length) {
                     let index = orderArray.findIndex(order => (order._id === element.orderId._id))
                     if (index === -1) {
                        orderArray.push(element.orderId);
                     }
                  } else {
                     orderArray.push(element.orderId);
                  }
               }
               return true
            })
         }
         dispatch(getAllServiceListSuccess(orderArray))
         done();
      }
   }
});

export const ServiceLogic = [
   addServiceLogic,
   getCannedServiceLogic,
   addCannedServiceLogic,
   deleteCannedServiceLogic,
   deleteServiceLogic,
   getAllServiceLogic
];