import { push } from "react-router-redux";

import { createLogic } from "redux-logic";
import { LoginLogics } from "./Login";

import { SignUpLogic } from "./SignUp";
import { UsersLogic } from "./Users";
import { CustomersLogic } from "./Customers";
import { MatrixLogic } from "./Matrix";
import { ProfileInfoLogic } from "./ProfileInfo";
import { FleetLogic } from "./Fleet";
import { LaboursLogic } from "./Labours";
import { StandardRateLogic } from "./RateStandard";
import { VehicleLogic } from "./Vehicles";
import { VendorLogic } from "./Vendor";
import { TiersLogic } from "./Tier";
import { InventoryPartsLogic } from "./InventoryParts";
import { InventoryStatsLogic } from "./inventoryStat";
import { OrderLogic } from "./Order";
import { InspectLogic } from "./Inspection";

import { ServiceLogic } from "./Service"
import { LabelLogic } from "./Label"

import { MessageLogic } from"./Message"
import { OrderSummaryLogic } from "./OrderSummary"
  import { from } from "rxjs";
export const redirectToLogic = createLogic({
  type: "REDIRET_TO",
  async process({ action }, dispatch, done) {
    dispatch(push(action.payload.path));
    done();
  }
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
  ...LaboursLogic,
  ...VendorLogic,
  ...TiersLogic,
  ...InventoryPartsLogic,
  ...InventoryStatsLogic,
  ...OrderLogic,
  ...InspectLogic,
  ...ServiceLogic,
  ...LabelLogic,
  ...MessageLogic,
  ...OrderSummaryLogic,
  redirectToLogic
];
