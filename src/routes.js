import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));
const WorkFlow = React.lazy(() => import("./containers/WorkFlow"));
const Calender = React.lazy(() => import("./containers/Calender"));
const Inventory = React.lazy(() => import("./containers/Inventory"));
const TimeClocks = React.lazy(() => import("./containers/TimeClocks"));
const Reports = React.lazy(() => import("./containers/Reports"));
const Settings = React.lazy(() => import("./containers/Settings"));
const Users = React.lazy(() => import("./containers/Users"));
const Vehicles = React.lazy(() => import("./containers/Vehicles"));
const Customers = React.lazy(() => import("./containers/Customers"));
const CommonPage = React.lazy(() => import("./containers/CommonPage"));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/workflow", name: "WorkFlow", component: WorkFlow },
  { path: "/calender", exact: true, name: "Calender", component: Calender },
  { path: "/inventory", exact: true, name: "Inventory", component: Inventory },
  {
    path: "/timesheets",
    exact: true,
    name: "Time Clocks",
    component: TimeClocks
  },
  { path: "/reports", exact: true, name: "Reports", component: Reports },
  { path: "/settings", name: "Settings", component: Settings },
  { path: "/users", name: "Users", component: Users },
  { path: "/vehicles", name: "Vehicles", component: Vehicles },
  { path: "/customers", name: "Customers", component: Customers },
  { path: "/common", exact: true, name: "Common", component: CommonPage }
];

export default routes;
