import React, { Component } from "react";
import moment from "moment";
import {
  Button,
  Input,
  ButtonGroup
} from "reactstrap";
import { getSumOfArray, calculateValues, calculateSubTotal } from "../../../helpers"
import Dollor from "../../common/Dollor"
import "./index.scss";
import { CrmPaymentModel } from "../../common/CrmPaymentModal";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      query: "",
      orderStatus: false,
      activityLogs: []
    };
  }
  componentDidMount = () => {
    const { activityReducer } = this.props;
    this.setState({
      activityLogs: activityReducer.activity
    })
  }
  componentDidUpdate = ({ activityReducer }) => {
    const activityData = this.props.activityReducer
    if (activityReducer !== activityData) {
      this.setState({
        activityLogs: activityData.activity
      })
    }
  }
  handlePaymentModal = () => {
    const { modelInfoReducer, modelOperate } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { paymentModalOpen } = modelDetails;
    modelOperate({
      paymentModalOpen: !paymentModalOpen
    });
  }
  render() {
    const { orderReducer, profileReducer, modelInfoReducer, modelOperate } = this.props
    const { modelDetails } = modelInfoReducer;
    const { paymentModalOpen } = modelDetails
    const { activityLogs } = this.state
    const createdDate = orderReducer.orderItems ? moment(orderReducer.orderItems.createdAt || '').format("MMM Do YYYY LT") : '';
    const isInvoice = orderReducer.orderItems ? orderReducer.orderItems.isInvoice : '';
    const serviceWriter = profileReducer.profileInfo.firstName + ' ' + profileReducer.profileInfo.lastName
    const serviceData = orderReducer.orderItems ? orderReducer.orderItems.serviceId : ""
    let totalParts = 0, totalTires = 0, totalLabor = 0, orderSubTotal = 0, orderGandTotal = 0, serviceTotalArray,
      totalTax = 0, totalDiscount = 0;
    return (
      <div className={"workflow-right"}>
        <div className={""}>
          <div className={"d-flex justify-content-between pb-2 pl-2"}>
            <span><h4>Order Details</h4></span>
            <span><h4>(# {typeof this.props.orderReducer.orderId !== "object"
              ? this.props.orderReducer.orderId
              : null})</h4></span>
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
            <span><Button color={"secondary"} className={"btn btn-sm"}>Schedule</Button></span>
          </div>
          <div className={"d-flex justify-content-between pb-2 pl-2"}>
            <span className={"name-label"}>PO Number</span>
            <span><Button color={"secondary"} className={"btn btn-sm"}>+ Add</Button></span>
          </div>
          <div className={"d-flex justify-content-between pb-3 pl-2 pt-3 border-top authoris-block "}>
            <span className={"name-label"}>Authorization</span>
            <span>
              <ButtonGroup>
                <Button color={""} className={"btn btn-sm"} onClick={(e) => this.props.orderStatus('authorizStatus', false)}>
                  {orderReducer && !orderReducer.orderItems.status ? <span className={"bg-danger authoris-dot"}></span> : ''} Not Authorised
                      </Button>
                <Button color={""} className={"btn btn-sm active"} onClick={(e) => this.props.orderStatus('authorizStatus', true)}>
                  {orderReducer && orderReducer.orderItems.status ? <span className={"bg-success authoris-dot"}></span> : ''} Authorised
                      </Button>
              </ButtonGroup>
            </span>
          </div>
          <div className={"d-flex justify-content-between pb-2 pl-2 authoris-block"}>
            <span className={"name-label"}>Order Status</span>
            <span>
              <ButtonGroup>
                <Button color={""} className={!isInvoice ? "btn btn-sm active" : "btn btn-sm"} onClick={(e) => this.props.orderStatus('invoiceStatus', false)}>
                  Estimate
                </Button>
                <Button color={""} className={isInvoice ? "btn btn-sm active" : "btn btn-sm"} onClick={(e) => this.props.orderStatus('invoiceStatus', true)}>
                  Invoice
                </Button>
              </ButtonGroup>
            </span>
          </div>
          <div className={"d-flex justify-content-between pb-2 pl-2 pt-2"}>
            <span className={"name-label"}>Workflow</span>
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
        <div className={"service-warp"}>
          {serviceData && serviceData.length ? serviceData.map((item, index) => {
            let mainserviceTotal = [], serviceTotal, epa, discount, tax
            return (
              <div key={index} className={""}>
                {item.serviceId.serviceItems && item.serviceId.serviceItems.length ? item.serviceId.serviceItems.map((service, sIndex) => {
                  const calSubTotal = calculateSubTotal(service.cost || (service.tierSize ? service.tierSize[0].cost : null) || 0, service.qty || 0, service.hours || 0, (service.rate ? service.rate.hourlyRate : 0)).toFixed(2)
                  const subDiscount = calculateValues(calSubTotal || 0, service.discount.value || 0, service.discount.type);
                  const servicesSubTotal = (parseFloat(calSubTotal) - parseFloat(subDiscount)).toFixed(2);
                  mainserviceTotal.push(parseFloat(servicesSubTotal))
                  serviceTotalArray = getSumOfArray(mainserviceTotal)
                  epa = calculateValues(serviceTotalArray || 0, item.serviceId.epa.value || 0, item.serviceId.epa ? item.serviceId.epa.type : '$');
                  discount = calculateValues(serviceTotalArray || 0, item.serviceId.discount.value || 0, item.serviceId.discount ? item.serviceId.discount.type : '$');
                  tax = calculateValues(serviceTotalArray || 0, item.serviceId.taxes.value || 0, item.serviceId.taxes ? item.serviceId.taxes.type : '$');
                  serviceTotal = (parseFloat(serviceTotalArray) + parseFloat(epa) + parseFloat(tax) - parseFloat(discount)).toFixed(2);
                  if (service.serviceType === 'part') {
                    totalParts += parseFloat(servicesSubTotal)
                  }
                  if (service.serviceType === 'tire') {
                    totalTires += parseFloat(servicesSubTotal)
                  }
                  if (service.serviceType === 'labor') {
                    totalLabor += parseFloat(servicesSubTotal)
                  }
                  orderSubTotal += (parseFloat(servicesSubTotal))
                  return true
                }) : ''

                }
                <span className={"d-none"}>{orderGandTotal += parseFloat(serviceTotal)}</span>
                <span className={"d-none"}>{totalTax += parseFloat(epa) + parseFloat(tax)}</span>
                <span className={"d-none"}>{totalDiscount += parseFloat(discount)}</span>
              </div>
            )
          })
            : ''
          }
          {serviceData && serviceData.length ?
            <>
              <div className={"w-100 text-right pull-right pr-2 order-total-block"}>
                <div>Total Parts : <Dollor value={totalParts.toFixed(2)} /></div>
                <div>Total Tires : <Dollor value={totalTires.toFixed(2)} /></div>
                <div>Total Labor : <Dollor value={totalLabor.toFixed(2)} /></div>
                <div className={"pt-2 border-top mt-2"}>Sub Total: <Dollor value={orderSubTotal.toFixed(2)} /></div>
                <div>Total Tax : <Dollor value={!isNaN(totalTax) ? totalTax.toFixed(2) : 0.00} /></div>
                <div>Total Discount : <Dollor value={!isNaN(totalDiscount) ? totalDiscount.toFixed(2) : 0.00} /></div>
                <div className={"pt-2 border-top mt-2 grand-total"}>Grand Total : <Dollor value={!isNaN(orderGandTotal) ? orderGandTotal.toFixed(2) : 0.00} /></div>
              </div>
              <div className={"clearfix"}></div>
            </>
            : ''
          }
        </div>
        <hr />
        <div className={"text-center payment-section"}>
          <h6 className={orderGandTotal === 0 ? "text-success" : "text-warning"}>Remaining Balance <Dollor value={orderGandTotal.toFixed(2)} /></h6>
          <Button size={"sm"} onClick={this.handlePaymentModal} className={"btn btn-success btn-rounded"}>New Payment</Button>
        </div>
        <hr />
        <div className={"activity-logs"}>
          {
            activityLogs && activityLogs.length ?
              <h5 className={"mb-2 p-2 text-left"}>Activity</h5> :
              null
          }
          {activityLogs && activityLogs.length ? activityLogs.slice(0).reverse().map((activity, index) => {
            return (
              <div key={index} className={"activity-block p-3"}>
                <div className={"pr-3 text-left"}>
                  <span>{activity.activityPerson.firstName}{" "}{activity.activityPerson.lastName}{" "}{activity.type !== "NEW_ORDER" ? "changed" : null}{" "}{activity.name}</span>
                </div>
                <div className={"text-left activity-date"}>
                  <span>{moment(activity.createdAt).format("MMM Do YYYY, h:mm A")}</span>
                </div>
                <span className={activity.type === 'MESSAGE' ? "activity-icon activity-message" : "activity-icon activity-set"}>
                  {
                    activity.type !== "NEW_ORDER" ?
                      <i className={"fa fa-check"} /> :
                      null
                  }
                </span>
              </div>
            )
          }) : ""}
        </div>
        <CrmPaymentModel
          openPaymentModel={paymentModalOpen}
          handlePaymentModal={this.handlePaymentModal}
          payableAmmount={orderGandTotal}
          modelDetails={modelDetails}
          modelOperate={modelOperate}
          paymentType={""}
        />
      </div>
    )
  }
}


export default OrderDetails