import React, { Component } from "react";
import moment from "moment";
import { Button, ButtonGroup } from "reactstrap";
import {
  getSumOfArray,
  calculateValues,
  calculateSubTotal
} from "../../../helpers";
import Dollor from "../../common/Dollor";
import "./index.scss";
import { CrmPaymentModel } from "../../common/CrmPaymentModal";
import Select from "react-select";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      query: "",
      orderStatus: false,
      activityLogs: [],
      serviceDataObject: {},
      activeService: false
    };
  }
  componentDidMount = () => {
    const { activityReducer } = this.props;
    this.setState({
      activityLogs: activityReducer.activity
    });
  };
  componentDidUpdate = ({ activityReducer, isPrint }) => {
    const activityData = this.props.activityReducer;
    if (activityReducer !== activityData) {
      this.setState({
        activityLogs: activityData.activity
      });
    }
    if (isPrint !== this.props.isPrint) {
      this.setState({
        activeService: true
      });
    }
  };
  handlePaymentModal = () => {
    const { modelInfoReducer, modelOperate } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { paymentModalOpen } = modelDetails;
    modelOperate({
      paymentModalOpen: !paymentModalOpen
    });
  };

  handleType = (e, workflowStatus, orderId) => {
    this.props.updateOrderStatus({
      from: workflowStatus,
      to: e.id,
      orderId,
      destinationIndex: 0,
      sourceIndex: 0
    });
  };

  render() {
    const {
      orderReducer,
      profileReducer,
      modelInfoReducer,
      modelOperate,
      addPaymentRequest,
      paymentReducer
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { paymentModalOpen } = modelDetails;
    const paymentList = paymentReducer.paymentData.length
      ? paymentReducer.paymentData
      : [];
    const payedAmountList =
      paymentList &&
        paymentList.length &&
        paymentList[0].payedAmount &&
        paymentList[0].payedAmount.length
        ? paymentList[0].payedAmount
        : null;
    const { activityLogs } = this.state;
    const createdDate = orderReducer.orderItems
      ? moment(orderReducer.orderItems.createdAt || "").format("MMM Do YYYY LT")
      : "";
    const isInvoice = orderReducer.orderItems
      ? orderReducer.orderItems.isInvoice
      : "";
    const serviceWriter =
      profileReducer.profileInfo.firstName +
      " " +
      profileReducer.profileInfo.lastName;
    const serviceData = orderReducer.orderItems
      ? orderReducer.orderItems.serviceId
      : "";
    let totalParts = 0,
      totalTires = 0,
      totalLabor = 0,
      orderSubTotal = 0,
      orderGandTotal = 0,
      serviceTotalArray,
      totalTax = 0,
      totalDiscount = 0,
      totalPaiedAmount = 0;
    const orderStatus = orderReducer.orderStatus;
    const groupedOptions = [];
    orderStatus.map((status, index) => {
      return (
        //console.log(status),
        groupedOptions.push({ label: status.name, id: status._id })
      );
    });

    return (
      <div className={"workflow-right"}>
        <div className={""}>
          <div className={"d-flex justify-content-between pb-2 pl-2"}>
            <span>
              <h4>Order Details</h4>
            </span>
            <span>
              <h4>
                (#{" "}
                {typeof this.props.orderReducer.orderId !== "object"
                  ? this.props.orderReducer.orderId
                  : null}
                )
              </h4>
            </span>
          </div>
          <div className={"d-flex justify-content-between pb-2 pl-2 pt-2"}>
            <span className={"name-label"}>Service Writer</span>
            <span>{serviceWriter}</span>
          </div>
          <div className={"d-flex justify-content-between pb-2 pl-2"}>
            <span className={"name-label"}>Created At</span>
            <span>{createdDate}</span>
          </div>
          <div className={"d-flex justify-content-between pb-2 pl-2"}>
            <span className={"name-label"}>Appointment</span>
            <span>
              <Button color={"secondary"} className={"btn btn-sm"}>
                Schedule
              </Button>
            </span>
          </div>
          <div className={"d-flex justify-content-between pb-2 pl-2"}>
            <span className={"name-label"}>PO Number</span>
            <span>
              <Button color={"secondary"} className={"btn btn-sm"}>
                + Add
              </Button>
            </span>
          </div>
          <div
            className={
              "d-flex justify-content-between pb-3 pl-2 pt-3 border-top authoris-block "
            }
          >
            <span className={"name-label"}>Authorization</span>
            <span>
              <ButtonGroup>
                <Button
                  color={""}
                  className={
                    orderReducer && !orderReducer.orderItems.status
                      ? "btn btn-sm active"
                      : "btn btn-sm"
                  }
                  onClick={e => this.props.orderStatus("authorizStatus", false)}
                >
                  {orderReducer && !orderReducer.orderItems.status ? (
                    <span className={"bg-danger authoris-dot"} />
                  ) : (
                      ""
                    )}{" "}
                  Not Authorised
                </Button>
                <Button
                  color={""}
                  className={
                    orderReducer && !orderReducer.orderItems.status
                      ? "btn btn-sm"
                      : "btn btn-sm active"
                  }
                  onClick={e => this.props.orderStatus("authorizStatus", true)}
                >
                  {orderReducer && orderReducer.orderItems.status ? (
                    <span className={"bg-success authoris-dot"} />
                  ) : (
                      ""
                    )}{" "}
                  Authorised
                </Button>
              </ButtonGroup>
            </span>
          </div>
          <div
            className={
              "d-flex justify-content-between pb-2 pl-2 authoris-block"
            }
          >
            <span className={"name-label"}>Order Status</span>
            <span>
              <ButtonGroup>
                <Button
                  color={""}
                  className={!isInvoice ? "btn btn-sm active" : "btn btn-sm"}
                  onClick={e => this.props.orderStatus("invoiceStatus", false)}
                >
                  Estimate
                </Button>
                <Button
                  color={""}
                  className={isInvoice ? "btn btn-sm active" : "btn btn-sm"}
                  onClick={e => this.props.orderStatus("invoiceStatus", true)}
                >
                  Invoice
                </Button>
              </ButtonGroup>
            </span>
          </div>
          <div className={"d-flex justify-content-between pb-2 pl-2 pt-2"}>
            <span className={"name-label"}>Workflow</span>
            <Select
              defaultValue={groupedOptions.filter(
                item => item.id === orderReducer.orderItems.workflowStatus
              )}
              value={groupedOptions.filter(
                item => item.id === orderReducer.orderItems.workflowStatus
              )}
              options={groupedOptions}
              className="form-select w-50"
              onChange={e =>
                this.handleType(
                  e,
                  orderReducer.orderItems.workflowStatus,
                  orderReducer.orderItems._id
                )
              }
              classNamePrefix={"form-select-theme"}
            />
          </div>
          <hr />
        </div>
        <div className={"service-warp"}>
          {serviceData && serviceData.length
            ? serviceData.map((item, index) => {
              let mainserviceTotal = [],
                serviceTotal,
                epa,
                discount,
                tax;
              return (
                <div key={index} className={""}>
                  {item.serviceId && item.serviceId.serviceItems &&
                    item.serviceId.serviceItems.length
                    ? item.serviceId.serviceItems.map((service, sIndex) => {
                      const calSubTotal = calculateSubTotal(
                        service.retailPrice ||
                        (service.tierSize
                          ? service.tierSize[0].retailPrice
                          : null) ||
                        0,
                        service.qty || 0,
                        service.hours || 0,
                        service.rate ? service.rate.hourlyRate : 0
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
                        item.serviceId.epa.value || 0,
                        item.serviceId.epa ? item.serviceId.epa.type : "$"
                      );
                      discount = calculateValues(
                        serviceTotalArray || 0,
                        item.serviceId.discount.value || 0,
                        item.serviceId.discount
                          ? item.serviceId.discount.type
                          : "$"
                      );
                      tax = calculateValues(
                        serviceTotalArray || 0,
                        item.serviceId.taxes.value || 0,
                        item.serviceId.taxes
                          ? item.serviceId.taxes.type
                          : "$"
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
                      orderSubTotal += parseFloat(servicesSubTotal);

                      return true;
                    })
                    : ""}

                  <span className={"d-none"}>
                    {(orderGandTotal += parseFloat(serviceTotal) || 0)}
                  </span>
                  <span className={"d-none"}>
                    {(totalTax += parseFloat(epa) + parseFloat(tax) || 0)}
                  </span>
                  <span className={"d-none"}>
                    {(totalDiscount += parseFloat(discount) || 0)}
                  </span>
                </div>
              );
            })
            : ""}
          {paymentList && paymentList.length
            ? paymentList.map(paymentData => {
              totalPaiedAmount +=
                paymentData.payedAmount[paymentData.payedAmount.length - 1]
                  .amount;
              return true;
            })
            : null}
          {serviceData && serviceData.length ? (
            <>
              <div
                className={"w-100 text-right pull-right pr-2 order-total-block"}
              >
                <div>
                  Total Parts : <Dollor value={totalParts.toFixed(2)} />
                </div>
                <div>
                  Total Tires : <Dollor value={totalTires.toFixed(2)} />
                </div>
                <div>
                  Total Labor : <Dollor value={totalLabor.toFixed(2)} />
                </div>
                <div className={"pt-2 border-top mt-2"}>
                  Sub Total: <Dollor value={orderSubTotal.toFixed(2)} />
                </div>
                <div>
                  Total Tax :{" "}
                  <Dollor
                    value={!isNaN(totalTax) ? totalTax.toFixed(2) : 0.0}
                  />
                </div>
                <div>
                  Total Discount :{" "}
                  <Dollor
                    value={
                      !isNaN(totalDiscount) ? totalDiscount.toFixed(2) : 0.0
                    }
                  />
                </div>
                <div className={"pt-2 border-top mt-2 grand-total"}>
                  Grand Total :{" "}
                  <Dollor
                    value={
                      !isNaN(orderGandTotal) ? orderGandTotal.toFixed(2) : 0.0
                    }
                  />
                </div>
                <div className={"pt-2"}>
                  Total Paid Amount :{" "}
                  <Dollor value={parseFloat(totalPaiedAmount).toFixed(2)} />
                </div>
              </div>
              <div className={"clearfix"} />
            </>
          ) : (
              ""
            )}
        </div>
        <hr />
        <div className={"text-center payment-section"}>
          <h6
            className={
              orderGandTotal - totalPaiedAmount === 0
                ? "text-success"
                : "text-warning"
            }
          >
            Remaining Balance{" "}
            <Dollor
              value={parseFloat(orderGandTotal - totalPaiedAmount).toFixed(2)}
            />
          </h6>
          <Button
            size={"sm"}
            onClick={this.handlePaymentModal}
            className={"btn btn-success btn-rounded"}
          >
            New Payment
          </Button>
        </div>
        <div className={"activity-logs"}>
          {activityLogs && activityLogs.length ? (
            <h5 className={"mb-2 p-2 text-left"}>Payments</h5>
          ) : null}
          {paymentList && paymentList.length
            ? paymentList
              .slice(0)
              .reverse()
              .map((paymentData, pIndex) => {
                return (
                  <div key={pIndex} className={"activity-block p-3"}>
                    <div className={"pr-3 text-left"}>
                      <span>{`Paid $${paymentData.payedAmount[
                        paymentData.payedAmount.length - 1
                      ].amount.toFixed(2)} viea ${
                        paymentData.paymentType
                        } on date`}</span>
                    </div>
                    <div className={"text-left activity-date"}>
                      <span>
                        {moment(
                          paymentData.payedAmount[
                            paymentData.payedAmount.length - 1
                          ].date
                        ).format("MMM Do YYYY, h:mm A")}
                      </span>
                    </div>
                    <span className={"activity-icon payment-set"}>
                      <i className={"fa fa-dollar-sign"} />
                    </span>
                  </div>
                );
              })
            : null}
        </div>
        <hr />
        <div className={"activity-logs"}>
          {activityLogs && activityLogs.length ? (
            <h5 className={"mb-2 p-2 text-left"}>Activity</h5>
          ) : null}
          {activityLogs && activityLogs.length
            ? activityLogs
              .slice(0)
              .reverse()
              .map((activity, index) => {
                return (
                  <div key={index} className={"activity-block p-3"}>
                    <div className={"pr-3 text-left"}>
                      <span>
                        {activity.activityPerson.firstName}{" "}
                        {activity.activityPerson.lastName}{" "}
                        {activity.type !== "NEW_ORDER" &&
                          activity.type !== "ADD_PAYMENT"
                          ? "changed"
                          : null}{" "}
                        {activity.name}
                      </span>
                    </div>
                    <div className={"text-left activity-date"}>
                      <span>
                        {moment(activity.createdAt).format(
                          "MMM Do YYYY, h:mm A"
                        )}
                      </span>
                    </div>
                    <span
                      className={
                        activity.type === "MESSAGE"
                          ? "activity-icon activity-message"
                          : "activity-icon activity-set"
                      }
                    >
                      {activity.type !== "NEW_ORDER" &&
                        activity.type !== "ADD_PAYMENT" ? (
                          <i className={"fa fa-check"} />
                        ) : null}
                      {activity.type === "ADD_PAYMENT" ? (
                        <i className={"fa fa-dollar-sign"} />
                      ) : null}
                    </span>
                  </div>
                );
              })
            : ""}
        </div>

        <CrmPaymentModel
          openPaymentModel={paymentModalOpen}
          handlePaymentModal={this.handlePaymentModal}
          payableAmmount={orderGandTotal}
          modelDetails={modelDetails}
          modelOperate={modelOperate}
          isPaymentChange={false}
          profileReducer={profileReducer}
          orderReducer={orderReducer}
          payedAmountList={payedAmountList}
          addPaymentRequest={addPaymentRequest}
          totalPaiedAmount={totalPaiedAmount}
        />
        <div>
          {/* {
           activeService ?
            () => this.props.handlePDF(
              totalParts,
              totalTires,
              totalLabor,
              orderSubTotal,
              orderGandTotal,
              serviceTotalArray,
              totalTax,
              totalDiscount,
              serviceData
            ) : null
        } */}
        </div>
      </div>
    );
  }
}

export default OrderDetails;
