import React, { Component, Suspense } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Input,
  FormFeedback,
  ButtonGroup
} from "reactstrap";
import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import {
  getOrderIdRequest,
  customerGetRequest,
  vehicleGetRequest,
  addNewInspection,
  addInspectionTemplate,
  addMessageTemplate,
  getMessageTemplate,
  getTemplateList,
  updateMessageTemplate,
  deleteMessageTemplate,
  searchMessageTemplateList,
  sendMessageTemplate,
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
  getOrderDetailsRequest,
  deleteLabel,
  getMatrixList,
  getRateStandardListRequest,
  rateAddRequest,
  setRateStandardListStart,
  getInventoryPartVendors
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
    this.orderNameRef = React.createRef();
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
  

  componentDidUpdate = ({ serviceReducers, inspectionReducer, orderReducer }) => {

    if ((serviceReducers.isLoading !== this.props.serviceReducers.isLoading) || (inspectionReducer.inspectionData.isSuccess !== this.props.inspectionReducer.inspectionData.isSuccess)) {
      this.props.getOrderDetailsRequest({ _id: this.props.match.params.id })
    }
    if ((orderReducer.orderItems !== this.props.orderReducer.orderItems) || orderReducer.isOrderLoading !== this.props.orderReducer.isOrderLoading) {
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
    if (customer && vehicle) {
      this.setState({
        customerData: customer,
        vehicleData: vehicle
      });
    } else if (customer && !vehicle) {
      this.setState({
        customerData: customer,
        vehicleData: ""
      });
    } else if (vehicle && !customer) {
      this.setState({
        customerData: "",
        vehicleData: vehicle
      });
    } else {
      this.setState({
        customerData: "",
        vehicleData: ""
      });
    }
  };
  handleEditOrder = () => {
    const { customerData, vehicleData, orderId, orderName } = this.state;
    logger("!!!!!!!!!!!!", customerData, vehicleData, orderId, orderName);
    if (!customerData || !vehicleData || !orderName) {
      this.setState({
        isError: true
      });
      return;
    }
    let customerValue, vehicleValue
    if (customerData.data && vehicleData.data) {
      customerValue = customerData.data._id
      vehicleValue = vehicleData.data._id
    } else {
      customerValue = customerData._id
      vehicleValue = vehicleData._id
    }
    const payload = {
      customerId: customerValue ? customerValue : null,
      vehicleId: vehicleValue ? vehicleValue : null,
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
      modelOperate,
      addNewInspection,
      addInspectionTemplate,
      addMessageTemplate,
      getMessageTemplate,
      getTemplateList,
      updateMessageTemplate,
      deleteMessageTemplate,
      searchMessageTemplateList,
      getPartDetails,
      addPartToService,
      addTireToService,
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
      addNewLabel,
      deleteLabel,
      sendMessageTemplate,
      orderReducer,
      getPriceMatrix,
      getStdList,
      addRate,
      profileInfoReducer,
      rateStandardListReducer,
      getInventoryPartsVendors } = this.props
    return (
      <div className="animated fadeIn">
        <Card className="white-card">
          <div className="workflow-section">
            <div className={"workflow-left"}>
              <CardBody className={"custom-card-body inventory-card"}>
                <div className={"d-flex order-info-block flex-row justify-content-between pb-2"}>
                  <div className={"order-info-head d-flex"}>
                    <h3 className={"mr-3 orderId"}>Order (#
                    {typeof this.props.orderReducer.orderId !== "object"
                        ? this.props.orderReducer.orderId
                        : null}
                      )
                    </h3>
                    <div className="input-block">
                      <Input
                        placeholder={"Enter a order title"}
                        onChange={e => this.handleChange(e)}
                        name={"orderName"}
                        value={orderName}
                        maxLength={"250"}
                        invalid={isError && !orderName}
                        className={"order-name-input"}
                      />
                      <FormFeedback>
                        {isError && !orderName
                          ? "Order name is required."
                          : null}
                      </FormFeedback>
                    </div>
                  </div>
                  {/* <div>
                    <Button
                      color={""}
                      onClick={() => this.handleEditOrder()}
                      className={"order-update-btn"}
                    >
                      Update Order
                  </Button>
                  </div> */}
                </div>
                
                <div className={"order-top-section"}>
                  <CustomerVehicle
                    getCustomerData={getCustomerData}
                    getVehicleData={getVehicleData}
                    customerVehicleData={this.customerVehicleData}
                    isError={isError}
                    handleEditOrder={this.handleEditOrder}
                    orderReducer={orderReducer}
                  />
                </div>
                <div className={"position-relative fdsfdsfdsf"}>
                  {console.log(this.props.orderReducer.orderItems.orderName, "fjdhsfkdshfkjdshfkjdhk")}
                  {this.props.orderReducer.orderItems && !this.props.orderReducer.orderItems.orderName  ?
                  
                    <div className={"service-overlay"}>
                      <img src="https://gramener.com/schoolminutes/img/arrow.png" alt={"arrow"}/>
                      <h3>
                        Please Add Order Details first 
                      </h3>
                    </div>  
                    : null
                }
                <div className={"position-relative"}>
                  <Suspense fallback={"Loading.."}>
                    <OrderTab
                      tabs={OrderTabs}
                      activeTab={activeTab}
                      onTabChange={this.onTabChange}
                    />
                  </Suspense>
                </div>
                  {/* <div className={"invt-add-btn-block"}>
                {this.renderAddNewButton()}
              </div> */}
                
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
                              deleteLabel={deleteLabel}
                              getPriceMatrix={getPriceMatrix}
                              getStdList={getStdList}
                              addRate={addRate}
                              profileInfoReducer={profileInfoReducer}
                              rateStandardListReducer={rateStandardListReducer}
                              getInventoryPartsVendors={getInventoryPartsVendors}
                              orderReducer={orderReducer}
                            />
                          ) : null}
                          {activeTab === 1 ? 
                          <Inspection
                            addNewInspection={addNewInspection}
                            inspectionData={this.props.inspectionReducer}
                            addInspectionTemplate={addInspectionTemplate}
                            getTemplateList={getTemplateList}
                            addMessageTemplate={addMessageTemplate}
                            getMessageTemplate={getMessageTemplate}
                            updateMessageTemplate={updateMessageTemplate}
                            deleteMessageTemplate={deleteMessageTemplate}
                            searchMessageTemplateList={searchMessageTemplateList}
                            customerData={customerData}
                            vehicleData={vehicleData}
                            sendMessageTemplate={sendMessageTemplate}
                            orderId={orderId}
                            profileReducer={profileInfoReducer}
                            orderReducer={orderReducer}
                          /> : null}
                          {activeTab === 2 ? <TimeClock /> : null}
                          {activeTab === 3 ? <Message /> : null}
                        </React.Fragment>
                      ) : null;
                    })}
                  </Switch>
                </Suspense>
                
                </div></CardBody>
            </div>
            <div className={"workflow-right"}>
              <div className={"pb-2"}>
                <div className={"d-flex justify-content-between pb-2"}>
                  <span><h4>Order Details</h4></span>
                  <span><h4>(# {typeof this.props.orderReducer.orderId !== "object"
                    ? this.props.orderReducer.orderId
                    : null})</h4></span>
                </div>
                <hr />
                <div className={"d-flex justify-content-between pb-2"}>
                  <span>Service Writer</span>
                  <span><Button color={"secondary"} className={"btn btn-sm"}>+ Add</Button></span>
                </div>
                <div className={"d-flex justify-content-between pb-2"}>
                  <span>Created At</span>
                  <span>5th June 2019 at 11:42 AM</span>
                </div>
                <div className={"d-flex justify-content-between pb-2"}>
                  <span>Appointment</span>
                  <span><Button color={"secondary"} className={"btn btn-sm"}>Schedule</Button></span>
                </div>
                <div className={"d-flex justify-content-between pb-2"}>
                  <span>PO Number</span>
                  <span><Button color={"secondary"} className={"btn btn-sm"}>+ Add</Button></span>
                </div>
                <hr />
                <div className={"d-flex justify-content-between pb-2"}>
                  <span>Authorization</span>
                  <span>
                    <ButtonGroup>
                      <Button color={"danger"} className={"btn btn-sm"}>Not Authorised</Button>
                      <Button color={"success"} className={"btn btn-sm"}>Authorised</Button>
                    </ButtonGroup>
                  </span>
                </div>
                <div className={"d-flex justify-content-between pb-2"}>
                  <span>Order Status</span>
                  <span>
                    <ButtonGroup>
                      <Button color={"secondary"} className={"btn btn-sm"}>Estimate</Button>
                      <Button color={"secondary"} className={"btn btn-sm"}>Invoice</Button>
                    </ButtonGroup>
                  </span>
                </div>
                <div className={"d-flex justify-content-between pb-2"}>
                  <span>Workflow</span>
                  <span>
                    <Input type={"select"} placeholder={"Select workflow status"}>
                      <option value="">Select workflow status</option>
                      <option value="estimate">Estimate</option>
                      <option value="droppedOff">Dropped Off</option>
                      <option value="inProcess">In Process</option>
                    </Input>
                  </span>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </Card>
        {/* {this.renderModals()} */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  orderReducer: state.orderReducer,
  inspectionReducer: state.inspectionReducer,
  modelInfoReducer: state.modelInfoReducer,
  serviceReducers: state.serviceReducers,
  labelReducer: state.labelReducer,
  profileInfoReducer: state.profileInfoReducer,
  rateStandardListReducer: state.rateStandardListReducer,
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
  addNewInspection: (data) => {
    dispatch(addNewInspection(data))
  },
  addInspectionTemplate: (data) => {
    dispatch(addInspectionTemplate(data))
  },
  getTemplateList: (data) => {
    dispatch(getTemplateList(data))
  },
  addMessageTemplate: (data) => {
    dispatch(addMessageTemplate(data))
  },
  getMessageTemplate: (data) => {
    dispatch(getMessageTemplate(data))
  },
  updateMessageTemplate: (data) => {
    dispatch(updateMessageTemplate(data))
  },
  deleteMessageTemplate: (data) => {
    dispatch(deleteMessageTemplate(data))
  },
  searchMessageTemplateList: (data) => {
    dispatch(searchMessageTemplateList(data))
  },
  getPartDetails: (data) => {
    dispatch(getInventoryPartsList(data))
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
  sendMessageTemplate: (data) => {
    dispatch(sendMessageTemplate(data))
  },
  updateOrderDetails: (data) => {
    dispatch(updateOrderDetailsRequest(data))
  },
  getOrderDetailsRequest: data => {
    dispatch(getOrderDetailsRequest(data));
  },
  deleteLabel: data => {
    dispatch(deleteLabel(data))
  },
  getPriceMatrix: data => {
    dispatch(getMatrixList(data));
  },
  getStdList: data => {
    dispatch(getRateStandardListRequest(data));
  },
  addRate: data => {
    dispatch(rateAddRequest(data));
  },
  setLabourRateDefault: data => {
    dispatch(setRateStandardListStart(data));
  },
  getInventoryPartsVendors: data => {
    dispatch(getInventoryPartVendors(data));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Order));
