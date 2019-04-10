import { push } from "react-router-redux";

import { createLogic } from "redux-logic";
import { LoginLogics } from "./Login";

import { SignUpLogic } from "./SignUp";
import { UsersLogic } from "./Users";
import { CustomersLogic } from "./Customers";
import { MatrixLogic } from "./Matrix";
import { ProfileInfoLogic } from "./ProfileInfo";
import { FleetAddLogic } from "./Fleet";
import { StandardRateLogic } from "./RateStandard";

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
  ...FleetAddLogic,
  redirectToLogic,
  ...StandardRateLogic,
  ...CustomersLogic,
  redirectToLogic
];
