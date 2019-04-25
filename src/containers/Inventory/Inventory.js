import React, { Component, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  UncontrolledTooltip,
  CardBody,
  CardHeader,
  Button
} from "reactstrap";
import {
  getRateStandardListRequest,
  setRateStandardListStart,
  labourAddRequest,
} from '../../actions';


import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import { CrmTyreModal } from "../../components/common/Tires/CrmTyreModal";
import { CrmLabourModal } from "../../components/common/Labours/CrmLabourModal";  
import { logger } from "../../helpers/Logger";
import CrmInventoryPart from "../../components/common/CrmInventoryPart";

const InventoryStats = React.lazy(() =>
  import("../../components/Inventory/InventoryStats")
);
const InventoryTab = React.lazy(() =>
  import("../../components/Inventory/InventoryTab")
);
const Parts = React.lazy(() => import("../../components/Inventory/Parts"));
const Tires = React.lazy(() => import("../../components/Inventory/Tires"));
const Labours = React.lazy(() => import("../../components/Inventory/Labours"));
const Vendors = React.lazy(() => import("../../components/Inventory/Vendors"));
export const InventoryRoutes = [
  {
    path: AppRoutes.INVENTORY_PARTS.url,
    name: AppRoutes.INVENTORY_PARTS.name,
    component: Parts
  },
  {
    path: AppRoutes.INVENTORY_TIRES.url, 
    name: AppRoutes.INVENTORY_TIRES.name,
    component: Tires
  },
  {
    path: AppRoutes.INVENTORY_LABOURS.url,
    name: AppRoutes.INVENTORY_LABOURS.name,
    component: Labours
  },
  {
    path: AppRoutes.INVENTORY_VENDORS.url,
    name: AppRoutes.INVENTORY_VENDORS.name,
    component: Vendors
  }
];
const InventoryTabs = [
  {
    name: AppRoutes.INVENTORY_PARTS.name,
    url: AppRoutes.INVENTORY_PARTS.url
  },
  {
    name: AppRoutes.INVENTORY_TIRES.name,
    url: AppRoutes.INVENTORY_TIRES.url
  },
  {
    name: AppRoutes.INVENTORY_LABOURS.name,
    url: AppRoutes.INVENTORY_LABOURS.url
  },
  {
    name: AppRoutes.INVENTORY_VENDORS.name,
    url: AppRoutes.INVENTORY_VENDORS.url
  }
];
class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }
  componentDidMount() {
    this.props.getStdList();
    const { location } = this.props;
    const index = InventoryTabs.findIndex(d => d.url === location.pathname);
    if (index > -1) {
      this.setState({
        activeTab: index
      });
    }
  }
  componentDidUpdate({ location }) {
    const { location: newLocation } = this.props;
    if (location.pathname !== newLocation.pathname) {
      const index = InventoryTabs.findIndex(
        d => d.url === newLocation.pathname
      );
      if (index > -1) {
        this.setState({
          activeTab: index
        });
      }
    }
  }
  onTypeHeadStdFun = data => {
    this.props.getStdList(data); 
  };
  setDefaultRate = value => {
    this.props.setLabourRateDefault(value);
  };
  onTabChange = activeTab => {
    this.props.redirectTo(InventoryTabs[activeTab].url);
  };
  addLabour= data =>{
    try {
      this.props.addLabour(data);
      this.setState({
        typeAddModalOpen: !this.state.typeAddModalOpen,
      });
    } catch (error) {
      logger(error)
    }
  }
  renderModals = () => {
    const { activeTab } = this.state;
    const { modelInfoReducer, modelOperate, rateStandardListReducer, profileInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { typeAddModalOpen, partAddModalOpen } = modelDetails;
    switch (InventoryTabs[activeTab].url) {
      case AppRoutes.INVENTORY_PARTS.url:
        return (
          <CrmInventoryPart
            isOpen={partAddModalOpen}
            toggle={() =>
              modelOperate({
                partAddModalOpen: !partAddModalOpen
              })
            }
          />
        );
      case AppRoutes.INVENTORY_TIRES.url:
        return (
          <CrmTyreModal
            tyreModalOpen={typeAddModalOpen}
            handleTierModal={() =>
              modelOperate({
                typeAddModalOpen: !typeAddModalOpen
              })
            }
          />
        );
      case AppRoutes.INVENTORY_LABOURS.url:
        return (
          <>
          <CrmLabourModal
            profileInfoReducer={profileInfoReducer.profileInfo}
            rateStandardListData={rateStandardListReducer}
            tyreModalOpen={typeAddModalOpen}
            onTypeHeadStdFun={this.onTypeHeadStdFun}
            setDefaultRate={this.setDefaultRate}
            getStdList={this.props.getStdList}
            addLabour={this.addLabour}
            handleLabourModal={() =>
              modelOperate({
                typeAddModalOpen: !typeAddModalOpen
              })
            }
          />
       
          </>
        );
      case AppRoutes.INVENTORY_VENDORS.url:
        return null;
      default:
        return null;
    }
  };
  onAddClick = () => {
    const { activeTab } = this.state;
    let modelDetails = {};
    switch (InventoryTabs[activeTab].url) {
      case AppRoutes.INVENTORY_PARTS.url:
        modelDetails = {
          partAddModalOpen: true
        };
        break;
      case AppRoutes.INVENTORY_TIRES.url:
        modelDetails = {
          typeAddModalOpen: true
        };
        break;
      case AppRoutes.INVENTORY_LABOURS.url:
          modelDetails = {
            typeAddModalOpen: true
          };
          break;
      case AppRoutes.INVENTORY_VENDORS.url:
        return null;
      default:
        return null;
    }
    this.props.modelOperate(modelDetails);
  };
  rednerAddNewButton = () => {
    const { activeTab } = this.state;
    return (
      <>
        <Button color="primary" onClick={this.onAddClick} id="add-user">
          <i className={"fa fa-plus"} />
          &nbsp; Add New
        </Button>
        <UncontrolledTooltip target={"add-user"}>
          Add New{" "}
          {InventoryTabs[activeTab].name.slice(
            0,
            InventoryTabs[activeTab].name.length - 1
          )}
        </UncontrolledTooltip>
      </>
    );
  };
  render() {
    const { activeTab } = this.state;
   
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <Row>
              <Col sm={"6"} className={"pull-left"}>
                <h4>
                  <i className={"fa fa-database"} />
                  &nbsp;Inventory
                </h4>
              </Col>
              <Col sm={"6"} className={"text-right"}>
                {this.rednerAddNewButton()}
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Suspense fallback={"Loading.."}>
              <InventoryStats />
            </Suspense>
            <Suspense fallback={"Loading.."}>
              <InventoryTab
                tabs={InventoryTabs}
                activeTab={activeTab}
                onTabChange={this.onTabChange}
              />
            </Suspense>
            <Suspense fallback={<Loader />}>
              <Switch>
                {InventoryRoutes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => <route.component {...props} />}
                    />
                  ) : null;
                })}
                <Redirect
                  from={AppRoutes.INVENTORY.url}
                  to={AppRoutes.INVENTORY_PARTS.url}
                />
              </Switch>
            </Suspense>
          </CardBody>
        </Card>
        {this.renderModals()}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
  rateStandardListReducer: state.rateStandardListReducer
});
const mapDispatchToProps = dispatch => ({
  getStdList: () => {
    dispatch(getRateStandardListRequest());
  },
  setLabourRateDefault: data => {
    dispatch(setRateStandardListStart(data));
  },
  addLabour: data => {
    dispatch(labourAddRequest(data));
  }
  
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Inventory));
