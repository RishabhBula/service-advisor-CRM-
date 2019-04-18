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

const InventoryStats = React.lazy(() =>
  import("../../components/Inventory/InventoryStats")
);
const InventoryTab = React.lazy(() =>
  import("../../components/Inventory/InventoryTab")
);
export const InventoryRoutes = [
  {
    path: AppRoutes.INVENTORY_PARTS.url,
    name: AppRoutes.INVENTORY_PARTS.name,
    component: InventoryStats
  },
  {
    path: AppRoutes.INVENTORY_TIRES.url,
    name: AppRoutes.INVENTORY_TIRES.name,
    component: InventoryTab
  },
  {
    path: AppRoutes.INVENTORY_LABOURS.url,
    name: AppRoutes.INVENTORY_LABOURS.name,
    component: InventoryStats
  },
  {
    path: AppRoutes.INVENTORY_VENDORS.url,
    name: AppRoutes.INVENTORY_VENDORS.name,
    component: InventoryTab
  }
];
class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  rednerAddNewButton = () => {
    return (
      <>
        <Button color="primary" id="add-user">
          <i className={"fa fa-plus"} />
          &nbsp; Add New
        </Button>
        <UncontrolledTooltip target={"add-user"}>
          Add New Part
        </UncontrolledTooltip>
      </>
    );
  };
  render() {
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
            <Suspense fallback={""}>
              <InventoryStats />
            </Suspense>
            <Suspense fallback={""}>
              <InventoryTab />
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
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inventory);
