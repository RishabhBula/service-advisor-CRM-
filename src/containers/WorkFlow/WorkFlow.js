import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { Col, Row, Card, CardBody, Button } from "reactstrap";
import WorkflowGridView from "../../components/Workflow/GridView";
import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import { addOrderRequest } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const Order = React.lazy(() => import("../Orders"));
export const OrderRoutes =
{
  path: AppRoutes.WORKFLOW_ORDER.url,
  exact: AppRoutes.WORKFLOW_ORDER.exact,
  name: AppRoutes.WORKFLOW_ORDER.name,
  component: Order
}

class WorkFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOrder = async () => {
    await this.props.addOrderRequest()
    /* const { orderData } = this.props.orderReducer
    this.props.redirectTo(`${OrderRoutes.path}/id:${orderData._id}`);
   */}

  render() {
    return (
      <Card className={"white-card"}>
        <CardBody className={"position-relative"}>
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
            <Col className={"title-right-section"}>
              <Button onClick={this.handleOrder} color={"primary"} id={"add-Appointment"}>
                <i className={"fa fa-plus mr-1"} /> New Quote
              </Button>
            </Col>
          </Row>
          <Row>
            <Col sm={"12"}>
              <WorkflowGridView />
            </Col>
          </Row>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route
                path={OrderRoutes.path}
                exact={OrderRoutes.exact}
                name={OrderRoutes.name}
                render={props => (
                  <OrderRoutes.component
                    {...props}
                    {...this.props}
                  />
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
  orderReducer: state.orderReducer,
});
const mapDispatchToProps = dispatch => ({
  addOrderRequest: (data) => {
    dispatch(addOrderRequest(data))
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(WorkFlow));