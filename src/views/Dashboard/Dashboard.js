import React, { Component } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CrmSubscriptionModel } from "../../components/common/CrmSubscriptionModal";
import {
  getSubscriptionPlanRequest,
  addSubscriptionRequest
} from "../../actions";
// import SubscriptionSettings from "../../components/Profile/SubscriptionSettings";

import CardComponent from "../../components/Dashboard/Card";
import CustomerIcon from "./../../assets/customers.svg";
import DashboardPlanDetails from "../../components/Dashboard/PlanDetails";
import InvoiceChart from "../../components/Dashboard/InvoiceChart";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          icon: CustomerIcon,
          text: "Orders",
          value: 10,
          key: "orders"
        },
        {
          icon: CustomerIcon,
          text: "Customers",
          value: 10,
          key: "customer"
        },
        {
          icon: CustomerIcon,
          text: "Vehicles",
          value: 10,
          key: "vehicle"
        },
        {
          icon: CustomerIcon,
          text: "Technicians",
          value: 10,
          key: "technicians"
        }
      ]
    };
  }
  componentDidMount = () => {};

  render() {
    const {
      modelInfoReducer,
      modelOperate,
      getSubscriptionPlanRequest,
      subscriptionReducer,
      addSubscriptionRequest
      // profileInfo
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { openSubscriptionModel, openSubPayementModel } = modelDetails;
    const { cards } = this.state;

    return (
      <div className="animated fadeIn dashboard-container ">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className={"white-card"}>
              <CardBody className={"custom-card-body position-relative"}>
                <Row>
                  <Col sm={"12"}>
                    <DashboardPlanDetails />
                  </Col>
                  {cards.map((card, index) => {
                    return (
                      <Col sm={"3"} key={index} className={"dashboard-card"}>
                        <CardComponent {...card} />
                      </Col>
                    );
                  })}
                </Row>
                <br />
                <Row>
                  <Col sm={"6"}>
                    <InvoiceChart />
                  </Col>
                  <Col sm={"6"}>
                    <InvoiceChart />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
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
  modelInfoReducer: state.modelInfoReducer,
  subscriptionReducer: state.subscriptionReducer,
  profileInfo: state.profileInfoReducer
});
const mapDispatchToProps = dispatch => ({
  getSubscriptionPlanRequest: () => dispatch(getSubscriptionPlanRequest()),
  addSubscriptionRequest: data => dispatch(addSubscriptionRequest(data))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
