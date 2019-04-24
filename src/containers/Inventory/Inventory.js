import React, { Component, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  Card,
  Row,
  Col,
  UncontrolledTooltip,
  CardBody,
  CardHeader,
  Button
} from "reactstrap";

import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import { CrmTyreModal } from "../../components/common/Tires/CrmTyreModal";
import CrmInventoryPart from "../../components/common/CrmInventoryPart";
import { getInventoryPartVendors, requestAddPart } from "../../actions";
import * as qs from "query-string";
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
  onTabChange = activeTab => {
    this.props.redirectTo(InventoryTabs[activeTab].url);
  };
  getQuerParams = () => {
    let query = qs.parse(this.props.location.search);
    if (query.vendorId) {
      query.vendorId = qs.parse(query.vendorId).value;
    }
    return query;
  };
  addInventoryPart = data => {
    const query = this.getQuerParams();
    this.props.addInventoryPart({ data, query });
  };
  renderModals = () => {
    const { activeTab } = this.state;
    const {
      modelInfoReducer,
      modelOperate,
      inventoryPartsData,
      getInventoryPartsVendors
    } = this.props;
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
            inventoryPartsData={inventoryPartsData}
            getInventoryPartsVendors={getInventoryPartsVendors}
            addInventoryPart={this.addInventoryPart}
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
        return null;
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
        return null;
      case AppRoutes.INVENTORY_VENDORS.url:
        return null;
      default:
        return null;
    }
    this.props.modelOperate(modelDetails);
  };
  renderAddNewButton = () => {
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
                {this.renderAddNewButton()}
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
                      render={props => (
                        <route.component {...props} {...this.props} />
                      )}
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
  inventoryPartsData: state.inventoryPartsReducers
});
const mapDispatchToProps = dispatch => ({
  getInventoryPartsVendors: data => {
    dispatch(getInventoryPartVendors(data));
  },
  addInventoryPart: data => {
    dispatch(requestAddPart(data));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inventory);
