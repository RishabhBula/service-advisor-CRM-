import React, { Component, Suspense } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
} from "reactstrap";
import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import {
  getOrderIdRequest,
  customerGetRequest,
  vehicleGetRequest,
  getInventoryPartsList,
  addPartToService,
  requestAddPart
} from "../../actions";
import Services from "../../components/Orders/Services";
import Inspection from "../../components/Orders/Inspection";
import TimeClock from "../../components/Orders/TimeClock";
import Message from "../../components/Orders/Message";
import CustomerVehicle from "../../components/Orders/CutomerVehicle"
const OrderTab = React.lazy(() =>
  import("../../components/Orders/OrderTab")
);

export const OrderComponents = [
  {
    component: Services
  },
  {
    component: Inspection
  },
  {
    component: TimeClock
  },
  {
    component: Message
  }
];
const OrderTabs = [
  {
    name: AppRoutes.WORKFLOW_ORDER_SERVICES.name
  },
  {
    name: AppRoutes.WORKFLOW_ORDER_INSPECTION.name
  },
  {
    name: AppRoutes.WORKFLOW_ORDER_TIME_CLOCK.name
  },
  {
    name: AppRoutes.WORKFLOW_ORDER_MESSAGES.name
  }
];
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }
  componentDidMount() {
    this.props.getOrderId();
  }

  onTabChange = (activeTab) => {
    this.setState({
      activeTab: activeTab
    })
  }
  addInventoryPart = data => {
    this.props.addInventoryPart({ data });
  };

  render() {
    const { activeTab } = this.state;
    const {
      getVehicleData,
      getCustomerData,
      modelInfoReducer,
      getPartDetails,
      addPartToService,
      modelOperate,
      serviceReducers } = this.props
    return (
      <div className="animated fadeIn">
        <Card className="white-card">
          <CardBody className={"custom-card-body inventory-card"}>
            <div className={"d-flex justify-content-between pb-4"}>
              <h3>Order (#{typeof this.props.orderReducer.orderId !== 'object' ? this.props.orderReducer.orderId : null})</h3>
              <Button color={"primary"}>Save Order</Button>
            </div>
            <CustomerVehicle
              getCustomerData={getCustomerData}
              getVehicleData={getVehicleData}
            />
            <div className={"position-relative"}>
              <Suspense fallback={"Loading.."}>
                <OrderTab
                  tabs={OrderTabs}
                  activeTab={activeTab}
                  onTabChange={this.onTabChange}
                />
              </Suspense>
              {/* <div className={"invt-add-btn-block"}>
                {this.renderAddNewButton()}
              </div> */}
            </div>
            <Suspense fallback={<Loader />}>
              <Switch>
                {OrderComponents.map((route, idx) => {
                  return route.component ? (
                    <>
                      {
                        activeTab === 0 ?
                          <Services
                            modelInfoReducer={modelInfoReducer}
                            modelOperate={modelOperate}
                            addPartToService={addPartToService}
                            getPartDetails={getPartDetails}
                            addInventoryPart={this.addInventoryPart}
                            serviceReducers={serviceReducers}
                          /> : null
                      }
                      {
                        activeTab === 1 ?
                          <Inspection /> : null
                      }
                      {
                        activeTab === 2 ?
                          <TimeClock /> : null
                      }
                      {
                        activeTab === 3 ?
                          <Message /> : null
                      }
                    </>
                  ) : null;
                })}
              </Switch>
            </Suspense>
          </CardBody>
        </Card>
        {/* {this.renderModals()} */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  orderReducer: state.orderReducer,
  modelInfoReducer: state.modelInfoReducer,
  serviceReducers: state.serviceReducers
});
const mapDispatchToProps = dispatch => ({
  getOrderId: () => {
    dispatch(getOrderIdRequest());
  },
  getCustomerData: (data) => {
    dispatch(customerGetRequest(data))
  },
  getVehicleData: (data) => {
    dispatch(vehicleGetRequest(data))
  },
  getPartDetails: (data) => {
    dispatch(getInventoryPartsList(data))
  },
  addPartToService: (data) => {
    dispatch(addPartToService(data))
  },
  addInventoryPart: (data) => {
    dispatch(requestAddPart(data))
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Order));
