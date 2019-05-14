import { connect } from "react-redux";
import { Container } from "reactstrap";
import { Redirect, Route, Switch } from "react-router-dom";
import React, { Component, Suspense } from "react";

// sidebar nav config
import navigation, { ValidatedRoutes } from "../../_nav";
import {
  profileInfoRequest,
  updateCompanyLogo,
  updateCompanyDetails,
  modelOpenRequest
} from "../../actions";
// routes config
import routes, { BreadCrumbRoutes } from "../../routes";
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
import NoAccess from "../NoAccess";
import { WildCardRoutes } from "../../config/Constants";
const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccess: true,
      isCustVehiclemodal: false
    };
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
      if (WildCardRoutes.indexOf(currentPage) === -1) {
        const ind = ValidatedRoutes.findIndex(d => d.url === currentPage);
        logger(ind, currentPage);
        if (ind > -1) {
          if (profileInfo.permissions[ValidatedRoutes[ind].authKey]) {
            logger("Allowed to use");
          } else {
            this.setState({
              hasAccess: false
            });
          }
        } else {
          this.signOut();
        }
      }
    }
  }
  signOut() {
    localStorage.removeItem("token");
    this.props.redirectTo("/login");
  }
  renderCompanyDetailsPopup = profileInfo => {
    const { firstTimeUser, parentId, firstName } = profileInfo;
    if (firstTimeUser && !parentId) {
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
    this.setState({
      isCustVehiclemodal: true
    });
    let data = {
      custAndVehicle: !modelDetails.custAndVehicle,
      custAndVehicleCustomer: !modelDetails.custAndVehicle
    };
    this.props.modelOperate(data);
  };

  customerAndVehicleModal = () => {
    return (
      <CustAndVehicle
        toggleModal={this.toggleCustAndVehicleProps}
        isCustVehiclemodal={this.state.isCustVehiclemodal}
        {...this.props}
      />
    );
  };
  render() {
    const { profileInfoReducer } = this.props;
    const { isLoading, profileInfo } = profileInfoReducer;
    const { permissions, shopLogo } = profileInfo;
    const { hasAccess } = this.state;
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
            <AppBreadcrumb appRoutes={BreadCrumbRoutes} />
            <Container fluid>
              {hasAccess ? (
                <>
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
                      <Redirect
                        from={AppRoutes.HOME.url}
                        to={AppRoutes.DASHBOARD.url}
                      />
                    </Switch>
                  </Suspense>
                </>
              ) : (
                <NoAccess redirectTo={this.props.redirectTo} />
              )}
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
