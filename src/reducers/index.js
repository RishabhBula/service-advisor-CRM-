import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import { handleActions } from "redux-actions";

import { usersReducer } from "./Users";
import { profileInfoReducer } from "./ProfileInfo";
import { matrixListReducer } from "./MatrixList";
import { fleetListReducer } from "./FleetList";
import { rateStandardListReducer } from "./RateStandard";
import { customerInfoReducer, customerListReducer } from "./Customer";
import { modelInfoReducer } from "./ModelOperation";

export const mainReducer = handleActions(
  {
    SHOW_LOADER: (state, action) => ({
      showLoader: true,
    }),
    HIDE_LOADER: (state, action) => ({
      showLoader: false,
    }),
  },
  {
    showLoader: false,
  }
);

const AppReducer = combineReducers({
  mainReducer,
  usersReducer,
  profileInfoReducer,
  matrixListReducer,
  fleetListReducer,
  rateStandardListReducer,
  customerInfoReducer,
  modelInfoReducer,
  customerListReducer,
  routing: routerReducer,
});

export default AppReducer;
