import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import { Container } from "reactstrap";
// sidebar nav config
import navigation from "../../_nav";
import { profileInfoRequest } from "../../actions";
import { logger } from "../../helpers/Logger";
// routes config
import routes from "../../routes";
import FullPageLoader from "../Loader/FullPageLoader";
import Loader from "./../Loader/Loader";
import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from "@coreui/react";
const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.redirectTo("/login");
    } else {
      this.props.profileInfoAction();
    }
  }
  signOut(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    this.props.redirectTo("/login");
  }
  navigation = permissions => {
    logger(permissions, navigation);
    const navItems = {
      items: [],
    };
    navigation.items.forEach((nav, index) => {
      if (permissions[nav.authKey]) {
        navItems.items.push(nav);
      }
    });
    return navItems;
  };
  render() {
    const { profileInfoReducer } = this.props;
    const { isLoading, profileInfo } = profileInfoReducer;
    const { permissions } = profileInfo;
    return isLoading ? (
      <FullPageLoader />
    ) : (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={<Loader />}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar className="custom-sidebar" fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav
                navConfig={this.navigation(permissions || {})}
                {...this.props}
              />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={<Loader />}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component
                            {...props}
                            {...this.props}
                            permissions={permissions}
                          />
                        )}
                      />
                    ) : null;
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={<Loader />}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={<Loader />}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
});

const mapDispatchToProps = dispatch => ({
  profileInfoAction: () => {
    dispatch(profileInfoRequest());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
