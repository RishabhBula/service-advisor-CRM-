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
  logOutRequest,
  addOrderRequest,
  fleetAddRequest,
  getMatrixList,
  getRateStandardListRequest,
  setRateStandardListStart,
  getUsersList,
  customerGetRequest,
  vehicleGetRequest,
  getOrderListForSelect,
  addAppointmentRequest,
  getSubscriptionPlanRequest,
  addSubscriptionRequest
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
import { CrmSubscriptionModel } from "../../components/common/CrmSubscriptionModal";
import { WildCardRoutes } from "../../config/Constants";
import { isValidObjectId } from "../../helpers";
import moment from "moment";

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
      parentId: ''
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
      website,
      isInTrialPeriod
    } = profileInfo;
    if (firstTimeUser && !parentId && isInTrialPeriod) {
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
  renderSubscriptionModal = profileInfo => {
    const {
      isInTrialPeriod,
      planId,
      planExiprationDate
    } = profileInfo
    const d1 = moment(new Date()).toDate()
    const d2 = new Date(planExiprationDate);
    const diffTime = Math.abs(d1.getTime() - d2.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (!isInTrialPeriod && (isNaN(diffDays) || !planId)) {
      const { modelInfoReducer, modelOperate } = this.props
      const { modelDetails } = modelInfoReducer;
      const { openSubscriptionModel } = modelDetails
      modelOperate({
        openSubscriptionModel: !openSubscriptionModel
      })
    }
  }
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
    const { profileInfoReducer,
      addOrderRequest,
      rateStandardListReducer,
      matrixListReducer,
      addFleet,
      getMatrix,
      modelInfoReducer,
      getStdList,
      getUserData,
      getCustomerData,
      getVehicleData,
      getOrders,
      addAppointment,
      getSubscriptionPlanRequest,
      subscriptionReducer,
      addSubscriptionRequest,
      modelOperate,
      setLabourRateDefault } = this.props;
    const { isLoading, profileInfo } = profileInfoReducer;
    const { permissions } = profileInfo;
    const { hasAccess, shopLogo } = this.state;
    const parentId = profileInfoReducer.profileInfo.parentId || ''
    const providerCompanyName = profileInfoReducer.profileInfo.companyName || parentId.companyName;
    const isLogoLoading = profileInfoReducer.isLogoLoading;
    const { modelDetails } = modelInfoReducer;
    const {
      showAddAppointmentModal,
      openSubscriptionModel,
      openSubPayementModel
    } = modelDetails;
    return isLoading ? (
      <FullPageLoader />
    ) : (
        <div className="app">
          {this.renderCompanyDetailsPopup(profileInfo || {})}
          {this.renderSubscriptionModal(profileInfo || {})}
          <AppHeader fixed>
            <Suspense fallback={""}>
              <DefaultHeader
                onLogout={e => this.signOut(e)}
                permissions={permissions || {}}
                shopLogo={shopLogo ? shopLogo : null}
                toggleCustAndVehicle={this.toggleCustAndVehicleProps}
                addOrderRequest={addOrderRequest}
                rateStandardListReducer={rateStandardListReducer}
                matrixListReducer={matrixListReducer}
                profileInfoReducer={profileInfoReducer}
                addFleet={addFleet}
                getMatrix={getMatrix}
                getStdList={getStdList}
                setLabourRateDefault={setLabourRateDefault}
                showAddAppointmentModal={showAddAppointmentModal}
                getUserData={getUserData}
                getCustomerData={getCustomerData}
                getVehicleData={getVehicleData}
                getOrders={getOrders}
                addAppointment={addAppointment}
                {...this.props}
              />
            </Suspense>
          </AppHeader>
          <div className="app-body">
            <AppSidebar className="custom-sidebar" fixed display="lg">
              {shopLogo || parentId.shopLogo ? (
                <div className={"provider-logo"}>
                  {!isLogoLoading ? (
                    <img src={shopLogo || parentId.shopLogo} alt={"logo"} />
                  ) : (
                      <img
                        src={
                          "https://loading.io/spinners/google/index.flip-circle-google-loader-gif.svg"
                        }
                        alt={"logo"}
                      />
                    )}
                </div>
              ) : (
                  <div
                    className={"provider-logo company-name"}
                    id={"comapnyName"}
                  >
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
                  src={"./assets/img/logo-white.svg"}
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
          <CrmSubscriptionModel
            openSubscriptionModel={openSubscriptionModel}
            modelOperate={modelOperate}
            openSubPayementModel={openSubPayementModel}
            getSubscriptionPlanRequest={getSubscriptionPlanRequest}
            subscriptionReducer={subscriptionReducer}
            addSubscriptionRequest={addSubscriptionRequest}
          />
        </div>
      );
  }
}

const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
  modelInfoReducer: state.modelInfoReducer,
  rateStandardListReducer: state.rateStandardListReducer,
  matrixListReducer: state.matrixListReducer,
  subscriptionReducer: state.subscriptionReducer,
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logOutRequest()),
  profileInfoAction: () => dispatch(profileInfoRequest()),
  updateCompanyLogo: data => dispatch(updateCompanyLogo(data)),
  onCompanyDetailsUdpate: data => dispatch(updateCompanyDetails(data)),
  modelOperate: data => dispatch(modelOpenRequest({ modelDetails: data })),
  addOrderRequest: () => dispatch(addOrderRequest()),
  addFleet: data => { dispatch(fleetAddRequest(data)) },
  getMatrix: (data) => { dispatch(getMatrixList(data)) },
  getStdList: () => { dispatch(getRateStandardListRequest()) },
  setLabourRateDefault: data => { dispatch(setRateStandardListStart(data)) },
  getUserData: data => dispatch(getUsersList(data)),
  getCustomerData: data => dispatch(customerGetRequest(data)),
  getVehicleData: data => dispatch(vehicleGetRequest(data)),
  getOrders: data => dispatch(getOrderListForSelect(data)),
  addAppointment: data => dispatch(addAppointmentRequest(data)),
  getSubscriptionPlanRequest: () => dispatch(getSubscriptionPlanRequest()),
  addSubscriptionRequest: (data) => dispatch(addSubscriptionRequest(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);
