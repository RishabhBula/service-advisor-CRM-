import { connect } from "react-redux";
import { Container, UncontrolledTooltip } from "reactstrap";
import { Redirect, Route, Switch } from "react-router-dom";
import React, { Component, Suspense } from "react";

// sidebar nav config
import navigation, { ValidatedRoutes } from "../../_nav";
import {
  profileInfoRequest,
  updateCompanyLogo,
  updateCompanyDetails,
  modelOpenRequest,
  logOutRequest
} from "../../actions";
// routes config
import routes, { BreadCrumbRoutes } from "../../routes";
import FullPageLoader from "../Loader/FullPageLoader";
import Loader from "./../Loader/Loader";
import Avtar from "../../components/common/Avtar" 
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
import { logger } from "../../helpers/Logger";
import { AppRoutes } from "../../config/AppRoutes";
import NoAccess from "../NoAccess";
import { WildCardRoutes } from "../../config/Constants";
import { isValidObjectId } from "../../helpers";
const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccess: true,
      isCustVehiclemodal: false,
      isURLChecked: false,
      shopLogo: "",
      parentId : ''
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.redirectTo("/login");
    } else {
      this.props.profileInfoAction();
    }
  }
  componentDidUpdate({ location, profileInfoReducer }) {
    const { location: newLocation } = this.props;
    const { profileInfo } = this.props.profileInfoReducer;
    const { isURLChecked } = this.state;
    if (
      (location.pathname !== newLocation.pathname || !isURLChecked) &&
      profileInfo &&
      profileInfo.permissions &&
      newLocation.pathname !== AppRoutes.HOME.url
    ) {
      let currentPage = this.props.location.pathname;
      // if (WildCardRoutes.indexOf(currentPage) === -1) {
        let currentPageArr = currentPage.split("/");
        let inde = [];
        currentPageArr.forEach((value, index) => {
          if (isValidObjectId(value)) {
            inde.push(index);
          }
        });
        for (let index = 0; index < inde; index++) {
          currentPageArr[inde[index]] = ":id";
        }
        currentPage = currentPageArr.join("/");
        const ind = ValidatedRoutes.findIndex(d => d.url === currentPage);

        logger(ind, currentPage, location);
      const isWildCardRoute = WildCardRoutes.indexOf(currentPage) > -1
      if (ind > -1 || isWildCardRoute) {
        if (profileInfo.permissions[ValidatedRoutes[ind].authKey] || isWildCardRoute) {
            logger("Allowed to use");
            this.setState({
              hasAccess: true
            });
          } else {
            this.setState({
              hasAccess: false
            });
          }
        } else {
          // this.signOut();
          this.setState({
            hasAccess: false
          });
        }
      // } else {
      //   this.signOut();
      // }
      this.setState({ isURLChecked: true });
    }
    
    if (
      profileInfoReducer.profileInfo !==
      this.props.profileInfoReducer.profileInfo
    ) {
      this.setState({
        shopLogo: this.props.profileInfoReducer.profileInfo.shopLogo,
        parentId: this.props.profileInfoReducer.profileInfo.parentId
      })
    }
    
    console.log(this.state.shopLogo, "profileInfo profileInfo")
  }
  signOut() {
    this.props.logoutUser();
  }
  renderCompanyDetailsPopup = profileInfo => {
    const {
      firstTimeUser,
      parentId,
      firstName,
      companyName,
      website
    } = profileInfo;
    if (firstTimeUser && !parentId) {
      return (
        <CrmWelcomeModel
          modalOpen={true}
          userName={firstName}
          companyName={companyName}
          website={website}
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
    const { permissions } = profileInfo;
    const { hasAccess, shopLogo } = this.state;
    const parentId = profileInfoReducer.profileInfo.parentId || ''
    const providerCompanyName = profileInfoReducer.profileInfo.companyName || parentId.companyName;
    console.log(parentId, "parentId")
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
              shopLogo={shopLogo ? shopLogo : null}
              toggleCustAndVehicle={this.toggleCustAndVehicleProps}
            />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar className="custom-sidebar" fixed display="lg">
              {shopLogo || parentId.shopLogo ? (
              <div
                className={"provider-logo"}
                  style={{ backgroundImage: `url(${shopLogo || parentId.shopLogo})` }}
              />
            ) : (
              <div className={"provider-logo company-name"} id={"comapnyName"}>
                <Avtar value={providerCompanyName} class={"name"} />
                <UncontrolledTooltip target={"comapnyName"}>
                  {profileInfo.companyName}
                </UncontrolledTooltip>
              </div>
            )}
            <div className={"company-logo"}>{providerCompanyName}</div>
            {/* <AppNavbarBrand
                full={{
                  src: shopLogo || "/assets/img/logo-white.svg",
                  alt: "Service Adviser",
                }}
                minimized={{
                  src: shopLogo || "/assets/img/logo-white.svg",
                  width: 50,
                  height: 50,
                  alt: "Service Adviser"
                }}
              /> */}

            <AppSidebarHeader />
            <AppSidebarForm />

            <Suspense>
              <AppSidebarNav
                navConfig={this.navigation(permissions || {})}
                {...this.props}
              />
            </Suspense>
            <div className={"text-center nav-footer-logo"}>
              <img
                src={"../../assets/img/logo-white.svg"}
                alt={"service-advisor"}
                width={70}
              />
              <div>Service Adviser</div>
              {/* <span className={"powered-by-line"}>Powered by</span> */}
            </div>
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
  logoutUser: () => dispatch(logOutRequest()),
  profileInfoAction: () => dispatch(profileInfoRequest()),
  updateCompanyLogo: data => dispatch(updateCompanyLogo(data)),
  onCompanyDetailsUdpate: data => dispatch(updateCompanyDetails(data)),
  modelOperate: data => dispatch(modelOpenRequest({ modelDetails: data }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);
