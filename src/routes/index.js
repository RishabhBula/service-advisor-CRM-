import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import '../App.scss';



// Containers
const DefaultLayout = React.lazy(() => import('../containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('../containers/Auth/Login'));
const Register = React.lazy(() => import("../containers/Auth/Register"));
const ForGotPassword = React.lazy(() =>
  import("../containers/Auth/ForGotPassword")
);
const ResetPassword = React.lazy(() =>
  import("../containers/Auth/ResetPassword")
);

const Page404 = React.lazy(() => import('../views/Pages/Page404'));
const Page500 = React.lazy(() => import('../views/Pages/Page500'));



class AppRoutes extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/login"
          name="Login Page"
          render={props => <Login {...props} />}
        />
        <Route
          exact
          path="/register"
          name="Register Page"
          render={props => <Register {...props} />}
        />
        <Route
          exact
          path="/forgot-password"
          name="Forgot Password/"
          render={props => <ForGotPassword {...props} />}
        />
        <Route
          exact
          path="/reset-password"
          name="Reset Password"
          render={props => <ResetPassword {...props} />}
        />
        {/* <Route
          exact
          path="/common"
          name="Common Page"
          render={props => <CommonPage {...props} />}
        /> */}
        <Route
          exact
          path="/404"
          name="Page 404"
          render={props => <Page404 {...props} />}
        />
        <Route
          exact
          path="/500"
          name="Page 500"
          render={props => <Page500 {...props} />}
        />
        <Route
          path="/"
          name="Home"
          render={props => <DefaultLayout {...props} />}
        />
      </Switch>
    );
  }
}
export default withRouter(AppRoutes);
