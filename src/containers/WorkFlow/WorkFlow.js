import { Col, Row, Card, CardBody, Button } from "reactstrap";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import React, { Component, Suspense } from "react";

import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import WorkflowGridView from "../../components/Workflow/GridView";
import { getOrderList, updateOrderStatus } from "../../actions";

const Order = React.lazy(() => import("../Orders"));
export const OrderRoutes = {
  path: AppRoutes.WORKFLOW_ORDER.url,
  exact: AppRoutes.WORKFLOW_ORDER.exact,
  name: AppRoutes.WORKFLOW_ORDER.name,
  component: Order
};

class WorkFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getOrders();
  }
  handleOrder = () => {
    this.props.redirectTo(OrderRoutes.path);
  };

  render() {
    const { orderReducer, updateOrderStatus } = this.props;
    const { orderData, orderStatus } = orderReducer;
    return (
      <Card className={"white-card position-relative"}>
        <CardBody>
          <Row className={"mb-4"}>
            <Col className={"title-left-section"}>
              <h4 className={"card-title"}>WorkFlow</h4>
              <div className={"workflow-mode"}>
                <div className={"mode-inner"}>
                  <div className={"mode-flow"}>
                    <button
                      className={"nav-icon icon-list btn btn-outline-dark"}
                    />
                  </div>
                  <div className="mode-flow">
                    <button
                      className={"nav-icon icon-grid btn btn-outline-dark"}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col className={"title-right-section invt-add-btn-block"}>
              <Button
                onClick={this.handleOrder}
                color={"primary"}
                id={"add-Appointment"}
              >
                <i className={"fa fa-plus mr-1"} /> New Quote
              </Button>
            </Col>
          </Row>
          <Row>
            <Col sm={"12"}>
              <WorkflowGridView
                orderData={orderData}
                orderStatus={orderStatus}
                updateOrderStatus={updateOrderStatus}
              />
            </Col>
          </Row>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route
                path={OrderRoutes.path}
                exact={OrderRoutes.exact}
                name={OrderRoutes.name}
                render={props => (
                  <OrderRoutes.component {...props} {...this.props} />
                )}
              />
            </Switch>
          </Suspense>
        </CardBody>
      </Card>
    );
  }
}
const mapStateToProps = state => ({
  orderReducer: state.orderReducer
});
const mapDispatchToProps = dispatch => ({
  getOrders: () => dispatch(getOrderList()),
  updateOrderStatus: data => dispatch(updateOrderStatus(data))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkFlow);
