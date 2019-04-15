import { createAction } from "redux-actions";

export * from "./Login";
export * from "./SignUp";
export * from "./Users";
export * from "./Customers";
export * from "./Matrix";
export * from "./ProfileInfo";
export * from "./RateStandard";
export * from "./Fleet";
export * from "./ModelOperation";
export * from "./Vehicles";
//
export const redirectTo = createAction("REDIRET_TO");
//
export const showLoader = createAction("SHOW_LOADER");
export const hideLoader = createAction("HIDE_LOADER");
