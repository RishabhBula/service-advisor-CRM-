import React, { Component, Suspense } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Col,
  Input,
  FormGroup,
  Label,
  Row,
  FormFeedback
} from "reactstrap";
import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import {
  getOrderIdRequest,
  customerGetRequest,
  vehicleGetRequest,
  getInventoryPartsList,
  addPartToService,
  addTireToService,
  requestAddPart,
  addNewTier,
  getTiersList,
  labourAddRequest,
  addLaborToService,
  labourListRequest,
  getUsersList,
  addNewService,
  getLabelList,
  addNewLabel,
  getCannedServiceList,
  updateOrderDetailsRequest,
  getOrderDetailsRequest
} from "../../actions";
import Services from "../../components/Orders/Services";
import Inspection from "../../components/Orders/Inspection";
import TimeClock from "../../components/Orders/TimeClock";
import Message from "../../components/Orders/Message";
import CustomerVehicle from "../../components/Orders/CutomerVehicle";
import { logger } from "../../helpers";

const OrderTab = React.lazy(() => import("../../components/Orders/OrderTab"));

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
      activeTab: 0,
      orderId: "",
      customerData: "",
      vehicleData: "",
      isError: false,
      orderName: "",
      isOrderSubbmited: false
    };
  }
  componentDidMount() {
    this.props.getOrderId();
    this.props.getLabelList();
    this.props.getCannedServiceList();
    this.setState({
      orderId: this.props.match.params.id
    });
    this.props.getOrderDetailsRequest({ _id: this.props.match.params.id });
  }

  componentDidUpdate = ({ serviceReducers, orderReducer }) => {
    if (serviceReducers.isLoading !== this.props.serviceReducers.isLoading) {
      this.props.getOrderDetailsRequest({ _id: this.props.match.params.id });
    }
    if (orderReducer.orderItems !== this.props.orderReducer.orderItems) {
      const {
        orderName,
        customerId,
        vehicleId
      } = this.props.orderReducer.orderItems;
      this.setState({
        orderName: orderName || "",
        customerData: customerId,
        vehicleData: vehicleId
      });
    }
  };

  onTabChange = activeTab => {
    this.setState({
      activeTab: activeTab
    });
  };
  addInventoryPart = data => {
    this.props.addInventoryPart({ data });
  };

  customerVehicleData = (customer, vehicle) => {
    this.setState({
      customerData: customer.data,
      vehicleData: vehicle.data
    });
  };
  handleEditOrder = () => {
    const { customerData, vehicleData, orderId, orderName } = this.state;
    if (!customerData || !vehicleData || !orderName) {
      logger("!!!!!!!!!!!!", customerData, vehicleData, orderId, orderName);
      this.setState({
        isError: true
      });
      return;
    }
    const payload = {
      customerId: customerData ? customerData._id : null,
      vehicleId: vehicleData ? vehicleData._id : null,
      orderName: orderName,
      _id: orderId
    };
    logger("*******payload*****", payload);
    this.props.updateOrderDetails(payload);
  };
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  render() {
    const {
      activeTab,
      customerData,
      vehicleData,
      isError,
      orderName,
      orderId
    } = this.state;
    const {
      getVehicleData,
      getCustomerData,
      modelInfoReducer,
      getPartDetails,
      addPartToService,
      addTireToService,
      modelOperate,
      serviceReducers,
      addLaborToService,
      addInventryTire,
      addLaborInventry,
      getTireDetails,
      getLaborDetails,
      getUserData,
      addNewService,
      labelReducer,
      getCannedServiceList,
      orderReducer,
      addNewLabel
    } = this.props;
    logger(customerData, vehicleData);
    return (
      <div className="animated fadeIn">
        <Card className="white-card">
          <Row>
            <Col md={"8"}>
              <CardBody className={"custom-card-body inventory-card"}>
                <div className={"d-flex justify-content-between pb-4"}>
                  <h3>
                    Order (#
                    {typeof this.props.orderReducer.orderId !== "object"
                      ? this.props.orderReducer.orderId
                      : null}
                    )
                  </h3>
                  <Button
                    color={"primary"}
                    onClick={() => this.handleEditOrder()}
                  >
                    Update Order
                  </Button>
                </div>
                <div className={"custom-form-modal mt-3"}>
                  <Row>
                    <Col md={"8"}>
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Order Name <span className={"asteric"}>*</span>
                        </Label>
                        <div className="input-block">
                          <Input
                            placeholder={"Enter a order title"}
                            onChange={e => this.handleChange(e)}
                            name={"orderName"}
                            value={orderName}
                            invalid={isError && !orderName}
                          />
                          <FormFeedback>
                            {isError && !orderName
                              ? "Order name is required."
                              : null}
                          </FormFeedback>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <CustomerVehicle
                  getCustomerData={getCustomerData}
                  getVehicleData={getVehicleData}
                  customerVehicleData={this.customerVehicleData}
                  isError={isError}
                  orderReducer={orderReducer}
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
                        <React.Fragment key={idx}>
                          {activeTab === 0 ? (
                            <Services
                              modelInfoReducer={modelInfoReducer}
                              modelOperate={modelOperate}
                              addPartToService={addPartToService}
                              addTireToService={addTireToService}
                              getPartDetails={getPartDetails}
                              addInventoryPart={this.addInventoryPart}
                              addInventryTire={addInventryTire}
                              serviceReducers={serviceReducers}
                              getTireDetails={getTireDetails}
                              addLaborInventry={addLaborInventry}
                              addLaborToService={addLaborToService}
                              getLaborDetails={getLaborDetails}
                              getUserData={getUserData}
                              addNewService={addNewService}
                              labelReducer={labelReducer}
                              addNewLabel={addNewLabel}
                              getCannedServiceList={getCannedServiceList}
                              customerData={customerData}
                              vehicleData={vehicleData}
                              orderId={orderId}
                            />
                          ) : null}
                          {activeTab === 1 ? <Inspection /> : null}
                          {activeTab === 2 ? <TimeClock /> : null}
                          {activeTab === 3 ? <Message /> : null}
                        </React.Fragment>
                      ) : null;
                    })}
                  </Switch>
                </Suspense>
              </CardBody>
            </Col>
            <Col md={"4"} />
          </Row>
        </Card>
        {/* {this.renderModals()} */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  orderReducer: state.orderReducer,
  modelInfoReducer: state.modelInfoReducer,
  serviceReducers: state.serviceReducers,
  labelReducer: state.labelReducer
});
const mapDispatchToProps = dispatch => ({
  getOrderId: () => {
    dispatch(getOrderIdRequest());
  },
  getCustomerData: data => {
    dispatch(customerGetRequest(data));
  },
  getVehicleData: data => {
    dispatch(vehicleGetRequest(data));
  },
  getPartDetails: data => {
    dispatch(getInventoryPartsList(data));
  },
  addPartToService: data => {
    dispatch(addPartToService(data));
  },
  addTireToService: data => {
    dispatch(addTireToService(data));
  },
  addInventoryPart: data => {
    dispatch(requestAddPart(data));
  },
  addInventryTire: data => {
    dispatch(addNewTier(data));
  },
  getTireDetails: data => {
    dispatch(getTiersList(data));
  },
  addLaborInventry: data => {
    dispatch(labourAddRequest(data));
  },
  addLaborToService: data => {
    dispatch(addLaborToService(data));
  },
  getLaborDetails: data => {
    dispatch(labourListRequest(data));
  },
  getUserData: data => {
    dispatch(getUsersList(data));
  },
  addNewService: data => {
    dispatch(addNewService(data));
  },
  getLabelList: () => {
    dispatch(getLabelList());
  },
  addNewLabel: data => {
    dispatch(addNewLabel(data));
  },
  getCannedServiceList: data => {
    dispatch(getCannedServiceList(data));
  },
  updateOrderDetails: data => {
    dispatch(updateOrderDetailsRequest(data));
  },
  getOrderDetailsRequest: data => {
    dispatch(getOrderDetailsRequest(data));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Order));
