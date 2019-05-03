import React from "react";
import { AppRoutes } from "./config/AppRoutes";

const Dashboard = React.lazy(() => import("./views/Dashboard"));
const WorkFlow = React.lazy(() => import("./containers/WorkFlow"));
const Calender = React.lazy(() => import("./containers/Calender"));
const Inventory = React.lazy(() => import("./containers/Inventory"));
const TimeClocks = React.lazy(() => import("./containers/TimeClocks"));
const Reports = React.lazy(() => import("./containers/Reports"));
const Settings = React.lazy(() => import("./containers/Settings"));
const Users = React.lazy(() => import("./containers/Users"));
const Vehicles = React.lazy(() => import("./containers/Vehicles"));
const Fleet = React.lazy(() => import("./containers/Fleet"));
const Customers = React.lazy(() => import("./containers/Customers"));
const CommonPage = React.lazy(() => import("./containers/CommonPage"));
const PriceMatrix = React.lazy(() => import("./containers/PriceMatrix"));
const routes = [
  {
    path: AppRoutes.HOME.url,
    exact: AppRoutes.HOME.exact,
    name: AppRoutes.HOME.name
  },
  {
    path: AppRoutes.DASHBOARD.url,
    exact: AppRoutes.DASHBOARD.exact,
    name: AppRoutes.DASHBOARD.name,
    component: Dashboard
  },
  {
    path: AppRoutes.WORKFLOW.url,
    exact: AppRoutes.WORKFLOW.exact,
    name: AppRoutes.WORKFLOW.name,
    component: WorkFlow
  },
  {
    path: AppRoutes.CALENDER.url,
    exact: AppRoutes.CALENDER.exact,
    name: AppRoutes.CALENDER.name,
    component: Calender
  },
  {
    path: AppRoutes.INVENTORY.url,
    exact: AppRoutes.INVENTORY.exact,
    name: AppRoutes.INVENTORY.name,
    component: Inventory
  },
  {
    path: AppRoutes.TIMESHEETS.url,
    exact: AppRoutes.TIMESHEETS.exact,
    name: AppRoutes.TIMESHEETS.name,
    component: TimeClocks
  },
  {
    path: AppRoutes.REPORTS.url,
    exact: AppRoutes.REPORTS.exact,
    name: AppRoutes.REPORTS.name,
    component: Reports
  },
  {
    path: AppRoutes.SETTINGS.url,
    exact: AppRoutes.SETTINGS.exact,
    name: AppRoutes.SETTINGS.name,
    component: Settings
  },
  {
    path: AppRoutes.STAFF_MEMBERS.url,
    exact: AppRoutes.STAFF_MEMBERS.exact,
    name: AppRoutes.STAFF_MEMBERS.name,
    component: Users
  },
  {
    path: AppRoutes.VEHICLES.url,
    exact: AppRoutes.VEHICLES.exact,
    name: AppRoutes.VEHICLES.name,
    component: Vehicles
  },
  {
    path: AppRoutes.FLEETS.url,
    exact: AppRoutes.FLEETS.exact,
    name: AppRoutes.FLEETS.name,
    component: Fleet
  },
  {
    path: AppRoutes.CUSTOMERS.url,
    exact: AppRoutes.CUSTOMERS.exact,
    name: AppRoutes.CUSTOMERS.name,
    component: Customers
  },
  {
    path: AppRoutes.PRICEMATRIX.url,
    exact: AppRoutes.PRICEMATRIX.exact,
    name: AppRoutes.PRICEMATRIX.name,
    component: PriceMatrix
  },
  { path: "/common", exact: true, name: "Common", component: CommonPage }
];

export default routes;
