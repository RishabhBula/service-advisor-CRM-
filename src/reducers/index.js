import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { handleActions } from "redux-actions";

import { usersReducer } from "./Users";
import { tiresReducer } from "./Tires";
import { profileInfoReducer } from "./ProfileInfo";
import { matrixListReducer } from "./MatrixList";
import { fleetReducer } from "./FleetList";
import { labourReducer } from "./Labours";
import { rateStandardListReducer } from "./RateStandard";
import { customerInfoReducer, customerListReducer } from "./Customer";
import { vehicleAddInfoReducer, vehicleListReducer } from "./Vehicles";
import { modelInfoReducer } from "./ModelOperation";
import { vendorsReducer } from "./Vendors"
import { inventoryPartsReducers } from "./InventoryParts";
import { inventoryStatsReducer } from "./InventorySats";
export const mainReducer = handleActions(
  {
    SHOW_LOADER: (state, action) => ({
      showLoader: true
    }),
    HIDE_LOADER: (state, action) => ({
      showLoader: false
    })
  },
  {
    showLoader: false
  }
);

const AppReducer = combineReducers({
  mainReducer,
  usersReducer,
  tiresReducer,
  profileInfoReducer,
  matrixListReducer,
  fleetReducer,
  labourReducer,
  rateStandardListReducer,
  customerInfoReducer,
  modelInfoReducer,
  customerListReducer,
  vehicleAddInfoReducer,
  vehicleListReducer,
  vendorsReducer,
  inventoryPartsReducers,
  inventoryStatsReducer,
  routing: routerReducer
});

export default AppReducer;
