import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import { hideLoader, showLoader, redirectTo } from "../actions";
import "../App.scss";
import FullPageLoader from "../containers/Loader/FullPageLoader";
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
const VerifyAccount = React.lazy(() =>
  import("../containers/Auth/VerifyAccount")
);

const Page404 = React.lazy(() => import("../views/Pages/Page404"));

const Routes = [
  {
    exact: true,
    path: "/login",
    name: "Login Page",
    component: Login
  },
  {
    exact: true,
    path: "/register",
    name: "Register Page",
    component: Register
  },
  {
    exact: true,
    path: "/forgot-password",
    name: "Forgot Password",
    component: ForGotPassword
  },
  {
    exact: true,
    path: "/reset-password",
    name: "Reset Password",
    component: ResetPassword
  },
  {
    exact: true,
    path: "/404",
    name: "Page Not Found",
    component: Page404
  },
  {
    exact: false,
    path: "/register/confirm/:userId/:activationCode",
    name: "Verify Account",
    component: VerifyAccount
  },
  {
    exact: false,
    path: "/",
    name: "Home",
    component: DefaultLayout
  }
];

class AppRoutes extends Component {
  render() {
    const { appState } = this.props;
    const { showLoader } = appState;
    return (
      <>
        {showLoader ? <FullPageLoader /> : null}
        <Switch>
          {Routes.map((route, index) => {
            return (
              <Route
                key={index}
                exact={route.exact}
                path={route.path}
                name={route.name}
                render={props => <route.component {...props} {...this.props} />}
              />
            );
          })}
        </Switch>
      </>
    );
  }
}
const mapStateToProps = state => ({
  appState: state.mainReducer
});
const mapDispatchToProps = dispatch => {
  return {
    showLoader: () => {
      dispatch(showLoader());
    },
    hideLoader: () => {
      dispatch(hideLoader());
    },
    redirectTo: path => {
      dispatch(redirectTo({ path }));
    }
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppRoutes)
);
