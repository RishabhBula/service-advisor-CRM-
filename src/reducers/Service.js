import { handleActions } from "redux-actions";
import { inventoryPartsActions, tiersActions, labourActions } from "./../actions";

const serviceData = {
   services: [
      {
         name: "",
         technician: "",
         note: "",
         serviceItems: []
      }
   ],
   isLoading: true
};

export const serviceReducers = handleActions(
   {
      [inventoryPartsActions.ADD_SERVICE_PART]: (state, action) => ({
         ...state,
         services: action.payload,
         isLoading: false
      })
   },
   serviceData
);
