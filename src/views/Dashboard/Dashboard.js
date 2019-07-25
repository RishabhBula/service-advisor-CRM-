import React, { Component } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CrmSubscriptionModel } from "../../components/common/CrmSubscriptionModal";
import {
  getSubscriptionPlanRequest,
  addSubscriptionRequest,
  getDashboardOverview,
  getDashboardCustomerSale
} from "../../actions";

import CardComponent from "../../components/Dashboard/Card";
import CustomerIcon from "./../../assets/customers.svg";
import OrderIcon from "./../../assets/product.svg";
import DeliveryTruckIcon from "./../../assets/delivery-truck.svg";
import TechnicianIcon from "./../../assets/car-service.svg";
import DashboardPlanDetails from "../../components/Dashboard/PlanDetails";
import InvoiceChart from "../../components/Dashboard/InvoiceChart";
import DashboardAppointments from "../../components/Dashboard/Appointments";
import { AppRoutes } from "../../config/AppRoutes";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          icon: OrderIcon,
          text: "Orders",
          value: 0,
          key: "orderCount",
          url: AppRoutes.WORKFLOW.url
        },
        {
          icon: CustomerIcon,
          text: "Customers",
          value: 0,
          key: "customerCount",
          url: AppRoutes.CUSTOMERS.url
        },
        {
          icon: DeliveryTruckIcon,
          text: "Vehicles",
          value: 0,
          key: "vehicleCount",
          url: AppRoutes.VEHICLES.url
        },
        {
          icon: TechnicianIcon,
          text: "Technicians",
          value: 0,
          key: "technicianCount",
          url: AppRoutes.STAFF_MEMBERS.url
        }
      ]
    };
  }
  componentDidMount = () => {
    this.props.getDashboardOverView();
    this.props.getDashboardCustomerSales();
  };

  render() {
    const {
      modelInfoReducer,
      modelOperate,
      getSubscriptionPlanRequest,
      subscriptionReducer,
      addSubscriptionRequest,
      dashboardData,
      redirectTo
      // profileInfo
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { openSubscriptionModel, openSubPayementModel } = modelDetails;
    const { cards } = this.state;
    const { overview } = dashboardData;
    const actualCards = cards.map(card => {
      return {
        ...card,
        value: overview[card.key]
      };
    });
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
                  {actualCards.map((card, index) => {
                    return (
                      <Col sm={"3"} key={index} className={"dashboard-card"}>
                        <CardComponent redirectTo={redirectTo} {...card} />
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
                    <DashboardAppointments />
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
  profileInfo: state.profileInfoReducer,
  dashboardData: state.dashboardReducer
});
const mapDispatchToProps = dispatch => ({
  getSubscriptionPlanRequest: () => dispatch(getSubscriptionPlanRequest()),
  addSubscriptionRequest: data => dispatch(addSubscriptionRequest(data)),
  getDashboardOverView: data => dispatch(getDashboardOverview(data)),
  getDashboardCustomerSales: data => dispatch(getDashboardCustomerSale(data))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
