import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import { Container } from "reactstrap";
// sidebar nav config
import navigation, { ValidatedRoutes } from "../../_nav";
import {
  profileInfoRequest,
  updateCompanyLogo,
  updateCompanyDetails,
  modelOpenRequest
} from "../../actions";
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
  AppSidebarNav
} from "@coreui/react";
import { CrmWelcomeModel } from "../../components/common/CrmWelcomeModel";
import CustAndVehicle from "../../components/common/CustomerAndVehicle/CustAndVehicle";
import { AppConfig } from "../../config/AppConfig";
import { logger } from "../../helpers/Logger";
import { AppRoutes } from "../../config/AppRoutes";
const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.redirectTo("/login");
    } else {
      this.props.profileInfoAction();
    }
  }
  componentDidUpdate({ location }) {
    const { profileInfoReducer, location: newLocation } = this.props;
    const { profileInfo } = profileInfoReducer;
    if (
      location.pathname !== newLocation.pathname &&
      profileInfo &&
      profileInfo.permissions &&
      newLocation.pathname !== AppRoutes.HOME.url
    ) {
      const currentPage = this.props.location.pathname;
      const ind = ValidatedRoutes.findIndex(d => d.url === currentPage);
      logger(ind, currentPage);
      if (ind > -1) {
        if (profileInfo.permissions[ValidatedRoutes[ind].authKey]) {
          logger("Allowed to use");
        } else {
          this.signOut();
        }
      } else {
        this.signOut();
      }
    }
  }
  signOut() {
    localStorage.removeItem("token");
    this.props.redirectTo("/login");
  }
  renderCompanyDetailsPopup = profileInfo => {
    const { companyName, parentId, firstName } = profileInfo;
    if (!companyName && !parentId) {
      return (
        <CrmWelcomeModel
          modalOpen={true}
          userName={firstName}
          onLogoUpdate={this.props.updateCompanyLogo}
          onCompanyDetailsUdpate={this.props.onCompanyDetailsUdpate}
        />
      );
    } else {
      return null;
    }
  };
  navigation = permissions => {
    const navItems = {
      items: []
    };
    navigation.items.forEach(nav => {
      if (permissions[nav.authKey]) {
        navItems.items.push(nav);
      }
    });
    return navItems;
  };

  toggleCustAndVehicleProps = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      custAndVehicle: !modelDetails.custAndVehicle
    };
    this.props.modelOperate(data);
  };

  customerAndVehicleModal = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    return (
      <CustAndVehicle
        displayModal={modelDetails.custAndVehicle}
        toggleModal={this.toggleCustAndVehicleProps}
      />
    );
  };
  render() {
    const { profileInfoReducer } = this.props;
    const { isLoading, profileInfo } = profileInfoReducer;
    const { permissions, shopLogo } = profileInfo;
    return isLoading ? (
      <FullPageLoader />
    ) : (
      <div className="app">
        {this.renderCompanyDetailsPopup(profileInfo || {})}
        <AppHeader fixed>
          <Suspense fallback={""}>
            <DefaultHeader
              onLogout={e => this.signOut(e)}
              permissions={permissions || {}}
              shopLogo={
                shopLogo
                  ? [AppConfig.IMAGE_ENDPOINT, shopLogo.thumbnailImage].join("")
                  : null
              }
              toggleCustAndVehicle={this.toggleCustAndVehicleProps}
            />
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
                            permissions={permissions || {}}
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
            <Suspense fallback={""}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={""}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
        {this.customerAndVehicleModal()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
  modelInfoReducer: state.modelInfoReducer
});

const mapDispatchToProps = dispatch => ({
  profileInfoAction: () => {
    dispatch(profileInfoRequest());
  },
  updateCompanyLogo: data => {
    dispatch(updateCompanyLogo(data));
  },
  onCompanyDetailsUdpate: data => {
    dispatch(updateCompanyDetails(data));
  },
  modelOperate: data => {
    dispatch(modelOpenRequest({ modelDetails: data }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);
