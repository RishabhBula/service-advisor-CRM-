import { handleActions } from "redux-actions";
import { inventoryPartsActions, tiersActions, labourActions, serviceActions } from "./../actions";

const serviceData = {
   services: [
      {
         isButtonValue: "",
         isConfirmedValue: {
            type: "",
            value: false
         },
         serviceName: "",
         technician: "",
         note: "",
         serviceItems: [],
         epa: {
            type: "%",
            value: ""
         },
         discount: {
            type: "%",
            value: "",
         },
         taxes: {
            type: "%",
            value: ""
         },
         serviceSubTotalValue: [],
         serviceTotal: "0.00",
         isError: false,
         isCannedAdded: false
      }
   ],
   submittedServiceId: [],
   customerCommentId: "",
   cannedServiceList: [],
   customerUserComment: {},
   isLoading: true,
   isServiceList: true
};

export const serviceReducers = handleActions(
   {
      [inventoryPartsActions.ADD_SERVICE_PART]: (state, action) => ({
         ...state,
         services: action.payload,
         isLoading: false
      }),
      [tiersActions.ADD_SERVICE_TIRE]: (state, action) => ({
         ...state,
         services: action.payload,
         isLoading: false
      }),
      [labourActions.ADD_SERVICE_LABOR]: (state, action) => ({
         ...state,
         services: action.payload,
         isLoading: false
      }),
      [serviceActions.ADD_SERVICE]: (state, action) => ({
         ...state,
         isLoading: true
      }),
      [serviceActions.ADD_SERVICE_SUCCESS]: (state, action) => ({
         ...state,
         isLoading: false,
         submittedServiceId: action.payload.serviceIds,
         customerCommentId: action.payload.customerCommentId,
         services: action.payload.services
      }),
      [serviceActions.GET_CANNED_SERVICE_LIST]: (state, action) => ({
         ...state,
         isLoading: true
      }),
      [serviceActions.GET_CANNED_SERVICE_LIST_SUCCESS]: (state, action) => ({
         ...state,
         cannedServiceList: action.payload.cannedServiceList,
         isLoading: false
      }),
      [serviceActions.GET_SERVICE_LIST]: (state, action) => ({
         ...state,
         isServiceList: true,
         services: []
      }),
      [serviceActions.GET_SERVICE_LIST_SUCCESS]: (state, action) => ({
         ...state,
         services: action.payload.services,
         customerUserComment: action.payload.customerCommentData,
         isServiceList: false
      }),
   },
   serviceData
);
