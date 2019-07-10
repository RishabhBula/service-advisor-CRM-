import { Card, CardBody, Input } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import React, { Component, Suspense } from "react";

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
  getInventoryPartVendors,
  addTimeLogRequest,
  updateTimeLogRequest,
  startTimer,
  stopTimer,
  switchTask,
  sendMessage,
  deleteNotes
} from "../../actions";
import Services from "../../components/Orders/Services";
import Inspection from "../../components/Orders/Inspection";
import TimeClock from "../../components/Orders/TimeClock";
import Message from "../../components/Orders/Message";
import CustomerVehicle from "../../components/Orders/CutomerVehicle";
import OrderDetails from "../../components/Orders/OrderDetails"
import { logger } from "../../helpers";
import qs from "query-string";
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
    const query = qs.parse(this.props.location.search);
    this.setState({
      orderId: this.props.match.params.id,
      activeTab: query.tab
        ? OrderTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
        : 0
    });
    this.props.getOrderDetailsRequest({ _id: this.props.match.params.id });

    // setTimeout(() => {
    //   this.orderNameRef.current.focus();
    // }, 10);
    logger(this.props.location);
  }
  componentDidUpdate = ({
    serviceReducers,
    inspectionReducer,
    orderReducer,
    messageReducer,
    location
  }) => {
    /**
     *
     */
    if (this.props.location.search !== location.search) {
      const query = qs.parse(this.props.location.search);
      this.setState({
        activeTab: query.tab
          ? OrderTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
          : 0
      });
    }
    if (
      serviceReducers.isLoading !== this.props.serviceReducers.isLoading ||
      inspectionReducer.inspectionData.isSuccess !==
      this.props.inspectionReducer.inspectionData.isSuccess
    ) {
      this.props.getOrderDetailsRequest({ _id: this.props.match.params.id });
    }
    if (
      orderReducer.orderItems !== this.props.orderReducer.orderItems ||
      orderReducer.isOrderLoading !== this.props.orderReducer.isOrderLoading || (messageReducer.messageData.isSuccess !== this.props.messageReducer.messageData.isSuccess)
    ) {
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
  /**
   *
   */
  onTabChange = activeTab => {
    this.props.redirectTo(
      `${AppRoutes.WORKFLOW_ORDER.url.replace(
        ":id",
        this.state.orderId
      )}?tab=${encodeURIComponent(OrderTabs[activeTab].name)}`
    );
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
    if (!customerData || !vehicleData) {
      this.setState({
        isError: true
      });
      return;
    }
    let customerValue, vehicleValue;
    if (customerData.data && vehicleData.data) {
      customerValue = customerData.data._id;
      vehicleValue = vehicleData.data._id;
    } else {
      customerValue = customerData._id;
      vehicleValue = vehicleData._id;
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

  orderStatus = (type, value) => {
    const { profileInfoReducer } = this.props
    const comapnyId = profileInfoReducer.profileInfo._id
    const { orderReducer } = this.props
    let payload = {}
    if (type === 'authorizStatus') {
      payload = {
        status: value,
        _id: orderReducer.orderItems._id,
        authorizerId: comapnyId,
        isChangedOrderStatus: true
      }
    }
    else {
      payload = {
        isInvoice: value,
        _id: orderReducer.orderItems._id,
      }
    }
    this.props.updateOrderDetails(payload)
  }

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
      getInventoryPartsVendors,
      addTimeLogRequest,
      timelogReducer,
      updateTimeLogRequest,
      startTimer,
      stopTimer,
      switchTimer,
      sendMessage,
      messageReducer,
      deleteNotes,
      activityReducer
    } = this.props;
    // const { orderIDurl, customerIDurl, companyIDurl } = orderReducer
    return (
      <div className="animated fadeIn">
        <Card className="white-card">
          <div className="workflow-section">
            <div className={"workflow-left"}>
              <CardBody className={"custom-card-body inventory-card"}>
                <div
                  className={
                    "d-flex order-info-block flex-row justify-content-between pb-2"
                  }
                >
                  <div className={"order-info-head d-flex"}>
                    <h3 className={"mr-3 orderId"}>
                      Order (#
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
                        className={"order-name-input"}
                        ref={this.orderNameRef}
                        autoFocus
                      />
                    </div>
                  </div>
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
                <div className={"position-relative"}>
                  {this.props.orderReducer.orderItems &&
                    !this.props.orderReducer.orderItems.customerId ?

                    <div className={"service-overlay"}>
                      <img src="https://gramener.com/schoolminutes/img/arrow.png" alt={"arrow"} />
                      <h3>
                        Please Add Order Details first
                      </h3>
                    </div>
                    : null
                  }
                  {/* <div className={"order-activity"}>
                    <span color="" className="print-btn">
                      <Link to={`/order-summary?orderId=${orderIDurl}&customerId=${customerIDurl}&companyIDurl=${companyIDurl}`} target="_blank"><i className="icon-eye icons"></i>&nbsp; View</Link>
                    </span>
                    <span id="add-Appointment" className="print-btn"><i className="icon-printer icons "></i>&nbsp; Print</span>
                  </div> */}
                  <div className={"position-relative"}>
                    <Suspense fallback={"Loading.."}>
                      <OrderTab
                        tabs={OrderTabs}
                        activeTab={activeTab}
                        onTabChange={this.onTabChange}
                      />
                    </Suspense>
                  </div>
                  <Suspense fallback={<Loader />}>
                    <React.Fragment>
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
                          {...this.props}
                        />
                      ) : null}
                      {activeTab === 1 ? (
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
                        />
                      ) : null}
                      {activeTab === 2 ? (
                        <TimeClock
                          modelInfoReducer={modelInfoReducer}
                          modelOperate={modelOperate}
                          orderId={orderId}
                          getUserData={getUserData}
                          orderItems={orderReducer.orderItems}
                          orderReducer={orderReducer}
                          addTimeLogRequest={addTimeLogRequest}
                          timelogReducer={timelogReducer}
                          editTimeLogRequest={updateTimeLogRequest}
                          startTimer={startTimer}
                          stopTimer={stopTimer}
                          switchTimer={switchTimer}
                        />
                      ) : null}
                      {activeTab === 3 ? <Message
                        searchMessageTemplateList={searchMessageTemplateList}
                        customerData={customerData}
                        vehicleData={vehicleData}
                        sendMessage={sendMessage}
                        profileReducer={profileInfoReducer}
                        orderId={orderId}
                        orderReducer={orderReducer}
                        messageReducer={messageReducer}
                        inspectionData={this.props.inspectionReducer}
                        addMessageTemplate={addMessageTemplate}
                        getMessageTemplate={getMessageTemplate}
                        updateMessageTemplate={updateMessageTemplate}
                        deleteMessageTemplate={deleteMessageTemplate}
                        deleteNotes={deleteNotes}
                        isSummary={false}
                      /> : null}
                    </React.Fragment>
                  </Suspense>
                </div>
              </CardBody>
            </div>
            <OrderDetails
              profileReducer={profileInfoReducer}
              orderReducer={orderReducer}
              orderStatus={this.orderStatus}
              activityReducer={activityReducer}
              modelInfoReducer={modelInfoReducer}
              modelOperate={modelOperate}
            />
          </div>
        </Card>
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
  timelogReducer: state.timelogReducer,
  messageReducer: state.messageReducer,
  activityReducer: state.activityReducer
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
  addNewInspection: data => {
    dispatch(addNewInspection(data));
  },
  addInspectionTemplate: data => {
    dispatch(addInspectionTemplate(data));
  },
  getTemplateList: data => {
    dispatch(getTemplateList(data));
  },
  addMessageTemplate: data => {
    dispatch(addMessageTemplate(data));
  },
  getMessageTemplate: data => {
    dispatch(getMessageTemplate(data));
  },
  updateMessageTemplate: data => {
    dispatch(updateMessageTemplate(data));
  },
  deleteMessageTemplate: data => {
    dispatch(deleteMessageTemplate(data));
  },
  searchMessageTemplateList: data => {
    dispatch(searchMessageTemplateList(data));
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
  sendMessageTemplate: data => {
    dispatch(sendMessageTemplate(data));
  },
  updateOrderDetails: data => {
    dispatch(updateOrderDetailsRequest(data));
  },
  getOrderDetailsRequest: data => {
    dispatch(getOrderDetailsRequest(data));
  },
  deleteLabel: data => {
    dispatch(deleteLabel(data));
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
  addTimeLogRequest: data => {
    dispatch(addTimeLogRequest(data))
  },
  updateTimeLogRequest: (data) => {
    dispatch(updateTimeLogRequest(data))
  },
  startTimer: data => dispatch(startTimer(data)),
  stopTimer: data => dispatch(stopTimer(data)),
  switchTimer: data => dispatch(switchTask(data)),
  sendMessage: data => {
    dispatch(sendMessage(data));
  },
  deleteNotes: data => {
    dispatch(deleteNotes(data))
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Order));