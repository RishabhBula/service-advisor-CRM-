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
         name: "",
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
         serviceSubTotalValue:[],
         serviceTotal: ""
      }
   ],
   cannedServiceList:[],
   isLoading: true,
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
         isLoading: false
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
   },
   serviceData
);
