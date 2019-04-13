import { push } from "react-router-redux";

import { createLogic } from "redux-logic";
import { LoginLogics } from "./Login";

import { SignUpLogic } from "./SignUp";
import { UsersLogic } from "./Users";
import { CustomersLogic } from "./Customers";
import { MatrixLogic } from "./Matrix";
import { ProfileInfoLogic } from "./ProfileInfo";
import { FleetLogic } from "./Fleet";
import { StandardRateLogic } from "./RateStandard";
import { VehicleLogic } from "./Vehicles";

export const redirectToLogic = createLogic({
  type: "REDIRET_TO",
  async process({ action }, dispatch, done) {
    dispatch(push(action.payload.path));
    done();
  },
});

export default [
  ...LoginLogics,
  ...SignUpLogic,
  ...UsersLogic,
  ...MatrixLogic,
  ...ProfileInfoLogic,
  ...FleetLogic,
  ...StandardRateLogic,
  ...CustomersLogic,
  ...VehicleLogic,
  redirectToLogic
];
