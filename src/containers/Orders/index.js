import { Card, CardBody, Input } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import React, { Component, Suspense } from "react";
import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import moment from "moment";
import * as jsPDF from "jspdf";
import "jspdf-autotable";

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
  deleteNotes,
  addPaymentRequest,
  addNewCannedService,
  deleteCannedServiceRequest,
  getOrderList,
  updateOrderStatus
} from "../../actions";
import Services from "../../components/Orders/Services";
import Inspection from "../../components/Orders/Inspection";
import TimeClock from "../../components/Orders/TimeClock";
import Message from "../../components/Orders/Message";
import CustomerVehicle from "../../components/Orders/CutomerVehicle";
import OrderDetails from "../../components/Orders/OrderDetails";
import SendInspection from "../../components/Orders/Inspection/sentInspect";
import MessageTemplate from "../../components/Orders/Inspection/messageTemplate";
import {
  logger,
  calculateSubTotal,
  getSumOfArray,
  calculateValues
} from "../../helpers";
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
      isPrint: false,
      isOrderSubbmited: false,
      serviceData: "",
      sentModal: false,
      mesageModal: false,
      pdfBlob: ""
    };
    this.orderNameRef = React.createRef();
  }
  componentDidMount() {
    this.props.getOrderId();
    this.props.getLabelList();
    this.props.getOrders();
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
      orderReducer.isOrderLoading !== this.props.orderReducer.isOrderLoading ||
      messageReducer.messageData.isSuccess !==
        this.props.messageReducer.messageData.isSuccess
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
    } else if (!customerData.data && vehicleData.data) {
      customerValue = customerData._id;
      vehicleValue = vehicleData.data._id;
    } else if (customerData.data && !vehicleData.data) {
      customerValue = customerData.data._id;
      vehicleValue = vehicleData._id;
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
    const { profileInfoReducer } = this.props;
    const comapnyId = profileInfoReducer.profileInfo._id;
    const { orderReducer } = this.props;
    let payload = {};
    if (type === "authorizStatus") {
      payload = {
        status: value,
        _id: orderReducer.orderItems._id,
        authorizerId: comapnyId,
        isChangedOrderStatus: true
      };
    } else {
      payload = {
        isInvoice: value,
        _id: orderReducer.orderItems._id
      };
    }
    this.props.updateOrderDetails(payload);
  };

  handelTemplateModal = () => {
    this.setState({
      sentModal: !this.state.sentModal
    });
    this.printInvoice({ sentinvoice: true });
  };

  toggleMessageTemplate = ele => {
    this.setState({
      mesageModal: !this.state.mesageModal
    });
  };

  printInvoice = sentinvoice => {
    const orderData = this.props.orderReducer.orderItems;
    const customerData = orderData.customerId;
    const serviceData = this.props.orderReducer.orderItems.serviceId;
    const comapnyInfo = this.props.profileInfoReducer.profileInfo;
    const vehilceInfo =
      orderData.vehicleId.year +
      " " +
      orderData.vehicleId.make +
      " " +
      orderData.vehicleId.modal;
    var doc = new jsPDF("p", "pt");
    var pdfWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(15);
    doc.setTextColor(51, 47, 62);
    doc.text("Invoice -: #" + orderData.orderId + "", 20, 40);
    doc.setFontSize(10);
    doc.text(
      "Created -: " +
        moment(orderData.createdAt || "").format("MMM Do YYYY") +
        "",
      20,
      54
    );

    doc.setFontSize(15);
    doc.setFontStyle("bold");
    var nameWidth = doc.getTextDimensions(comapnyInfo.companyName);
    doc.text(comapnyInfo.companyName, pdfWidth - (nameWidth.w + 25), 45);
    doc.setFontStyle("normal");

    doc.setLineWidth(0.1);
    doc.setDrawColor(187, 185, 193);
    doc.line(20, 60, 570, 60);

    doc.setFontSize(12);
    doc.text(customerData.firstName + " " + customerData.lastName, 20, 78);
    doc.setFontSize(10);
    doc.text(customerData.email, 20, 95);

    doc.setLineWidth(0.1);
    doc.line(300, 100, 300, 60); // vertical line

    doc.setFontSize(12);
    doc.text(vehilceInfo, 320, 78);

    doc.setLineWidth(0.1);
    doc.setDrawColor(187, 185, 193);
    doc.line(20, 100, 570, 100);

    let epa = 0,
      epaType = "",
      serviceDiscount = 0,
      serviceDiscountType = "",
      serviceTax = 0,
      serviceTaxType = "",
      totalParts = 0,
      totalTires = 0,
      totalLabor = 0,
      orderSubTotal = 0,
      orderGandTotal = 0,
      serviceTotalArray,
      totalTax = 0,
      totalDiscount = 0;

    let columnHeight = 110;
    let itemHeight = columnHeight;
    for (let i = 0; i < serviceData.length; i++) {
      epa = serviceData[i].serviceId.epa.value || 0;
      epaType = serviceData[i].serviceId.epa.type;
      serviceDiscount = serviceData[i].serviceId.discount.value || 0;
      serviceDiscountType = serviceData[i].serviceId.discount.type;
      serviceTax = serviceData[i].serviceId.taxes.value || 0;
      serviceTaxType = serviceData[i].serviceId.taxes.type || 0;
      doc.setDrawColor(187, 185, 193);
      doc.setFillColor(240, 243, 245);
      doc.rect(20, columnHeight, 550, 20, "FD");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(serviceData[i].serviceId.serviceName, 25, columnHeight + 14);

      let mainserviceTotal = [],
        serviceTotal,
        discount,
        tax,
        calSubTotal = 0;

      var columns = [
        { title: "Service Tile", dataKey: "Service Tile" },
        { title: "Price", dataKey: "Price" },
        { title: "Qty", dataKey: "Qty" },
        { title: "Hours", dataKey: "Hours" },
        { title: "Discount", dataKey: "Discount" },
        { title: "Sub total", dataKey: "Sub total" }
      ];
      var rows = [];
      var options = {};
      options = {
        margin: { left: 20 },
        startY: columnHeight + 21,
        tableWidth: pdfWidth - 45,
        columnStyles: {
          'Service Tile': { cellWidth: 150},
          'Price': { halign: 'left' },
          'Qty': { halign: 'left', cellWidth: 30 },
          'Hours': { halign: 'left', cellWidth: 30 },
          'Discount': { halign: 'left' },
          'Sub total': { halign: 'left' },
        },
        styles: {
          // minCellHeight: 5,
          cellPadding: 3,
          fontSize: 10,
          font: "helvetica", // helvetica, times, courier
          lineColor: 200,
          lineWidth: 0.1,
          lineHeight: 0,
          fontStyle: "normal", // normal, bold, italic, bolditalic
          overflow: "ellipsize", // visible, hidden, ellipsize or linebreak
          fillColor: 255,
          textColor: 20,
          halign: "left", // left, center, right
          valign: "middle", // top, middle, bottom
          fillStyle: "F", // 'S', 'F' or 'DF' (stroke, fill or fill then stroke)
          cellWidth: "auto", // 'auto', 'wrap' or a number
          minCellHeight: 20
        }
      };
      for (let j = 0; j < serviceData[i].serviceId.serviceItems.length; j++) {
        let service = serviceData[i].serviceId.serviceItems[j];
        var val = service.description || service.brandName || service.discription;

        var note = (service.serviceType === 'part' && service.partOptions && service.partOptions.showNoteOnQuoteAndInvoice ? ('{ ' + service.note + ' }') : '') || (service.serviceType === 'tire' && service.tierPermission && service.tierPermission.showNoteOnQuotesInvoices && service.tierSize[0].notes !== '' ? ('{ ' + service.tierSize[0].notes + ' }') : '');

        var partnumber = (service.serviceType === 'part' && service.partOptions && service.partOptions.showNumberOnQuoteAndInvoice && service.partNumber !== '' ? (service.partNumber) : '') || '';
        // var serviceType = service.serviceType;
        var qty = service.qty || "";
        var hours = service.hours;
        var hourlyRate = service.rate ? service.rate.hourlyRate : 0;
        var cost =
          service.cost ||
          (service.tierSize ? service.tierSize[0].cost : null) ||
          0;

        calSubTotal = calculateSubTotal(
          cost,
          qty || 0,
          hours || 0,
          hourlyRate
        ).toFixed(2);
        const subDiscount = calculateValues(
          calSubTotal || 0,
          service.discount.value || 0,
          service.discount.type
        );
        const servicesSubTotal = (
          parseFloat(calSubTotal) - parseFloat(subDiscount)
        ).toFixed(2);
        mainserviceTotal.push(parseFloat(servicesSubTotal));
        serviceTotalArray = getSumOfArray(mainserviceTotal);
        epa = calculateValues(
          serviceTotalArray || 0,
          epa || 0,
          epa ? epaType : "$"
        );
        discount = calculateValues(
          serviceTotalArray || 0,
          serviceDiscount || 0,
          serviceDiscount ? serviceDiscountType : "$"
        );
        tax = calculateValues(
          serviceTotalArray || 0,
          serviceTax || 0,
          serviceTax ? serviceTaxType : "$"
        );
        serviceTotal = (
          parseFloat(serviceTotalArray) +
          parseFloat(epa) +
          parseFloat(tax) -
          parseFloat(discount)
        ).toFixed(2);
        if (service.serviceType === "part") {
          totalParts += parseFloat(servicesSubTotal);
        }
        if (service.serviceType === "tire") {
          totalTires += parseFloat(servicesSubTotal);
        }
        if (service.serviceType === "labor") {
          totalLabor += parseFloat(servicesSubTotal);
        }
        orderSubTotal += (parseFloat(servicesSubTotal))

        var discountType = service.discount.type
        var discountValue = service.discount.value || 0
        var discountMainVal = ''
        discountMainVal = discountValue > 0 ? discountType === '%' ? (discountValue + '%') : ('$' + discountValue) : 0;
        rows.push({
          'Service Tile': val + ' ' + (partnumber || "") + ' ' + (note || "")  , 

          Price: service.serviceType === 'part' && service.partOptions && service.partOptions.showPriceOnQuoteAndInvoice ? '$' + cost : service.serviceType === 'tire' ? '$' +cost : '-' || '-',

          Qty: service.serviceType === 'part' && service.partOptions && service.partOptions.showPriceOnQuoteAndInvoice ? qty : service.serviceType === 'tire' ? qty : '-' || '-',
          Hours: hours || "-",
          Discount: discountMainVal,
          "Sub total": "$" + servicesSubTotal + ""
        });
      }

      doc.autoTable(columns, rows, options);

      orderGandTotal += parseFloat(serviceTotal);
      totalTax += parseFloat(epa) + parseFloat(tax);
      totalDiscount += parseFloat(discount);

      var rowCount = serviceData[i].serviceId.serviceItems.length;
      var rowHeight = (rowCount + 1) * 22;
      var finalY = doc.autoTable.previous.finalY;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(
        "EPA : $" + parseFloat(epa).toFixed(2) + "",
        180,
        columnHeight + rowHeight + 28
      );
      doc.text(
        "Discount : $" + parseFloat(discount).toFixed(2) + "",
        250,
        columnHeight + rowHeight + 28
      );
      doc.text(
        "Tax : $" + parseFloat(tax).toFixed(2) + "",
        335,
        columnHeight + rowHeight + 28
      );
      doc.text(
        "Service Total : $" + calSubTotal + "",
        455,
        columnHeight + rowHeight + 28
      );

      //  to plus and increase columnHeight for next item
      columnHeight = columnHeight + rowHeight + 40;
      // Last row  EPA DISCOUNT
    }
    itemHeight = finalY + 30;

    doc.setFontSize(12);
    doc.text(
      "Total Parts  : $" + totalParts.toFixed(2) + "",
      450,
      itemHeight + 30
    );
    doc.text(
      "Total Tires  : $" + totalTires.toFixed(2) + "",
      450,
      itemHeight + 45
    );
    doc.text(
      "Total Labor  : $" + totalLabor.toFixed(2) + "",
      450,
      itemHeight + 60
    );
    doc.text(
      "Sub Total : $" + orderSubTotal.toFixed(2) + "",
      450,
      itemHeight + 75
    );
    doc.text("Total Tax  : $" + totalTax.toFixed(2) + "", 450, itemHeight + 90);
    doc.text(
      "Total Discount : $" + totalDiscount.toFixed(2) + "",
      450,
      itemHeight + 105
    );
    doc.setDrawColor(187, 185, 193);
    doc.line(570, itemHeight + 110, 350, itemHeight + 110); // horizontal line
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFontStyle("bold");
    doc.text(
      "Grand Total  : $" + orderGandTotal.toFixed(2) + "",
      430,
      itemHeight + 127
    );

    if (itemHeight > 750) {
      doc.addPage();
    }
    var file = doc.output("dataurlstring");

    if (!sentinvoice) {
      window.open(doc.output("bloburl"), "_blank");
    } else {
      this.setState({
        pdfBlob: file
      });
    }
  };

  render() {
    const {
      activeTab,
      customerData,
      vehicleData,
      isError,
      orderName,
      orderId,
      pdfBlob
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
      activityReducer,
      addPaymentRequest,
      paymentReducer,
      addNewCannedService,
      deleteCannedServiceRequest,
      updateOrderStatus
    } = this.props;
    // const { orderIDurl, customerIDurl, companyIDurl } = orderReducer

    const sentinvoice = false;
    return (
      <div className="animated fadeIn">
        <Card className="white-card" id={"white-card"}>
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
                  (!this.props.orderReducer.orderItems.customerId ||
                    !this.props.orderReducer.orderItems.vehicleId) ? (
                    <div className={"service-overlay"}>
                      <img
                        src="https://gramener.com/schoolminutes/img/arrow.png"
                        alt={"arrow"}
                      />
                      <h3>Please Add Order Details first</h3>
                    </div>
                  ) : null}
                  <div className={"order-activity"}>
                    <span
                      color=""
                      className="print-btn"
                      onClick={this.handelTemplateModal}
                    >
                      {/* <Link to={`/order-summary?orderId=${orderIDurl}&customerId=${customerIDurl}&companyIDurl=${companyIDurl}`} target="_blank"><i className="icon-eye icons"></i>&nbsp; View</Link> */}
                      <i className="icons cui-cursor" />
                      &nbsp; Sent
                    </span>
                    <span
                      id="add-Appointment"
                      className="print-btn"
                      onClick={() => this.printInvoice(false)}
                    >
                      <i className="icon-printer icons " />
                      &nbsp; Print
                    </span>
                  </div>
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
                          getInventoryPartsVendors={
                            getInventoryPartsVendors
                          }
                          orderReducer={orderReducer}
                          addNewCannedService={addNewCannedService}
                          deleteCannedServiceRequest={deleteCannedServiceRequest}
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
                          searchMessageTemplateList={
                            searchMessageTemplateList
                          }
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
                      {activeTab === 3 ? (
                        <Message
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
                        />
                      ) : null}
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
              addPaymentRequest={addPaymentRequest}
              paymentReducer={paymentReducer}
              updateOrderStatus={updateOrderStatus}
            />
            <SendInspection
              isOpen={this.state.sentModal}
              toggle={this.handelTemplateModal}
              customerData={customerData}
              vehicleData={vehicleData}
              searchMessageTemplateList={this.props.searchMessageTemplateList}
              toggleMessageTemplate={this.toggleMessageTemplate}
              sendMessageTemplate={this.props.sendMessageTemplate}
              pdfBlob={pdfBlob}
              isOrder
            />
            <MessageTemplate
              isOpen={this.state.mesageModal}
              toggle={this.toggleMessageTemplate}
              inspectionData={this.props.inspectionReducer}
              addMessageTemplate={this.props.addMessageTemplate}
              getMessageTemplate={this.props.getMessageTemplate}
              updateMessageTemplate={this.props.updateMessageTemplate}
              deleteMessageTemplate={this.props.deleteMessageTemplate}
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
  activityReducer: state.activityReducer,
  paymentReducer: state.paymentReducer
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
    dispatch(addTimeLogRequest(data));
  },
  updateTimeLogRequest: data => {
    dispatch(updateTimeLogRequest(data));
  },
  startTimer: data => dispatch(startTimer(data)),
  stopTimer: data => dispatch(stopTimer(data)),
  switchTimer: data => dispatch(switchTask(data)),
  sendMessage: data => {
    dispatch(sendMessage(data));
  },
  deleteNotes: data => {
    dispatch(deleteNotes(data));
  },
  addPaymentRequest: data => {
    dispatch(addPaymentRequest(data));
  },
  addNewCannedService: data => {
    dispatch(addNewCannedService(data))
  },
  getOrders: () => dispatch(getOrderList()),
  updateOrderStatus: data => dispatch(updateOrderStatus(data)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Order));
