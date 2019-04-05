import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import "../App.scss";

// Containers
const DefaultLayout = React.lazy(() => import("../containers/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("../containers/Auth/Login"));
const Register = React.lazy(() => import("../containers/Auth/Register"));
const ForGotPassword = React.lazy(() =>
  import("../containers/Auth/ForGotPassword")
);
const ResetPassword = React.lazy(() =>
  import("../containers/Auth/ResetPassword")
);

const Page404 = React.lazy(() => import("../views/Pages/Page404"));

const Routes = [
  {
    exact: true,
    path: "/login",
    name: "Login Page",
    component: Login,
  },
  {
    exact: true,
    path: "/register",
    name: "Register Page",
    component: Register,
  },
  {
    exact: true,
    path: "/forgot-password",
    name: "Forgot Password",
    component: ForGotPassword,
  },
  {
    exact: true,
    path: "/reset-password",
    name: "Reset Password",
    component: ResetPassword,
  },
  {
    exact: true,
    path: "/404",
    name: "Page Not Found",
    component: Page404,
  },
  {
    exact: false,
    path: "/",
    name: "Home",
    component: DefaultLayout,
  },
];

class AppRoutes extends Component {
  render() {
    return (
      <Switch>
        {Routes.map((route, index) => {
          return (
            <Route
              key={index}
              exact={route.exact}
              path={route.path}
              name={route.name}
              render={props => <route.component {...props} />}
            />
          );
        })}
      </Switch>
    );
  }
}
export default withRouter(AppRoutes);
