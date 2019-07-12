import React, { Component } from "react";
import moment from "moment";
import { getSumOfArray, calculateValues, calculateSubTotal } from "../../helpers"
import Dollor from "../common/Dollor"

class OrderSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: '',
      customerData:''
    }
  }
  componentDidMount = () => {
    this.setState({
      orderData: this.props.summaryReducer.orderData,
      customerData: this.props.summaryReducer.userData
    })
  }
  componentDidUpdate = ({ summaryReducer }) => {
    const propData = this.props.summaryReducer
    if (summaryReducer.isSuccess !== propData.isSuccess ) {
      this.setState({
        orderData: this.props.summaryReducer.orderData
      })
    }
  }

  
  render() {
    const { orderData } = this.state
    const customerInfo = orderData ? orderData.customerId : "";
    //const orderStatus = orderData ? orderData.status: ""
    const vehicleInfo = orderData ? orderData.vehicleId : ""
    const orderID = orderData ? orderData.orderId : ""
    const createdDate = orderData ? orderData.createdAt : ""
    const serviceData = orderData ? orderData.serviceId : ""
    let totalParts = 0, totalTires = 0, totalLabor = 0, orderSubTotal = 0, orderGandTotal = 0, serviceTotalArray,
    totalTax = 0, totalDiscount = 0;
    
    const orderLabel = orderData && !orderData.isInvoice ? 'Estimate' : 'Invoice' 
  
    return (
      <>
        <div className={"summary-head d-flex flex-column  pt-2 pb-2"}>
          <div className={"d-flex flex-row justify-content-between"}>
            <h5 className={"mb-0"}>{orderLabel} #{orderID || ''}</h5>
          </div>
          <div>
            <h4>{orderData && orderData.orderItems ? orderData.orderItems.orderName : ''}</h4>
          </div>
        </div>
        <div className={"company-info-head d-flex flex-row justify-content-between pt-1 pb-1 pl-2 pr-2 border-bottom border-top  align-items-center"}>
          <h4 className={"mb-0"}>D-company</h4>
          <div>Created Date: {moment(createdDate || '').format("MMM Do YYYY")}</div>
        </div>
        <div className={"user-info d-flex justify-content-between"}>
          <div className={"border-right w-50 pt-2 pb-2 pl-2"}>
            {customerInfo ? <>
              <h4>{customerInfo.firstName}</h4>
              <div>{customerInfo ? customerInfo.email : ''}</div>
            </>
              : ''
            }
          </div>
          <div className={"w-50 pl-3 pt-2 pb-2 pr-2"}>
            {vehicleInfo ? <h4>{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.modal}</h4> : ''}
          </div>
        </div>

        <div className={"service-warp border-top"}>
          {serviceData && serviceData.length ? serviceData.map((item, index) => {
            let mainserviceTotal = [], serviceTotal, epa, discount, tax
            return (
              <div key={index} className={"mb-2 mt-2 border"}>
                <h4 className={"text-capitalize bg-light p-2 border-bottom"}>{item.serviceId.serviceName}</h4>
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
                  
                  return (
                    <div key={sIndex} className={"pb-2 border-bottom"}>
                      <div className={"pb-1 service-head pl-2 pr-2"}>
                        {service.description || service.brandName || service.discription}

                        {service.serviceType === 'part' && service.partOptions  && service.partOptions.showNumberOnQuoteAndInvoice && service.partNumber !== '' ? <span className="part-number"> ({ service.partNumber})</span>: ''} 
                        {service.serviceType === 'part' && service.partOptions && service.partOptions.showNoteOnQuoteAndInvoice ? <div className={"part-note"}>{service.note}</div> :''}

                        {service.serviceType === 'tire' && service.tierPermission && service.tierPermission.showNoteOnQuotesInvoices && service.tierSize[0].notes !== '' ? <div className={"part-note"}> ({service.tierSize[0].notes})</div> : ''}

                        {service.serviceType === 'labor' && service.permission && service.permission.showNoteOnQuotesInvoices && service.notes !== '' ? <div className={"part-note"}> ({service.notes})</div> : ''}

                      </div>
                      {
                        service.serviceType !== 'labor' ?
                          <div className={"d-flex pl-2 pr-2 entity"}>
                            {service.serviceType === 'part' && service.partOptions && service.partOptions.showPriceOnQuoteAndInvoice ? 
                              <><span className={"pr-3"}>Price : <Dollor value={service.cost || 0} /></span> 
                              <span className={"pr-3"}>QTY : {service.qty}</span></> : 
                              ''
                            }
                            {service.serviceType === "tire" ? <><span className={"pr-3"}>Price : <Dollor value={(service.tierSize ? service.tierSize[0].cost : null) || 0} /></span> <span className={"pr-3"}>QTY : {service.qty}</span> </>: ''
                            }
                            {/* <span className={"pr-3"}>QTY : {service.qty}</span> */}
                            <span>Discount : {service.discount.value || 0}</span>
                            <span className={"pull-right ml-auto"}>Sub Total : <Dollor value={servicesSubTotal} /></span>
                          </div> :
                          <div className={"d-flex pl-2 pr-2 entity"}>
                            {service.serviceType === "labor" && service.permission && service.permission.isShowHours ? 
                            <span className={"pr-3"}>Hours : {service.hours || 0}</span> : ''}  
                            <span className={"pr-3"}>Rate : {(service.rate ? service.rate.hourlyRate : 1)}</span>
                            <span>Discount : {service.discount.value || 0}</span>
                            <span className={"pull-right ml-auto"}> Sub Total : <Dollor value={calSubTotal} /></span>
                          </div>
                      }
                      
                    </div>
                  )
                }) : ''

                }
                <div className={"d-flex justify-content-end pl-2 pr-2 pt-3 pb-3"}>
                  <div className={"pr-3"}>
                    EPA : <span className={"value"}>
                      <span className="dollar-price"><i className="fa fa-dollar dollar-icon"></i>{parseFloat(epa).toFixed(2)}</span>
                    </span>
                  </div>

                  <div className={"pr-3"}>Discount : <Dollor value={parseFloat(discount).toFixed(2)} /></div>
                  <div className={"pr-2"}>Tax : <Dollor value={parseFloat(tax).toFixed(2)} /></div>
                  <div className={"w-25 text-right"}>Service Total : <Dollor value={!isNaN(serviceTotal) ? serviceTotal : 0.00} /></div>
                </div>
                <span className={"d-none"}>{orderGandTotal += parseFloat(serviceTotal)}</span>
                <span className={"d-none"}>{totalTax += parseFloat(epa) + parseFloat(tax)}</span>
                <span className={"d-none"}>{totalDiscount += parseFloat(discount)}</span>
              </div>
            )
          })
            : <h4 className={"pt-4 pb-4 text-center"}>Currently there is no any Serice Addded</h4>
          }
          {serviceData && serviceData.length ? 
          <>
          <div className={"w-50 text-right pull-right pr-2 order-total-block"}>
            <div>Total Parts : <Dollor value={totalParts.toFixed(2)}/></div>
            <div>Total Tires : <Dollor value={totalTires.toFixed(2)} /></div>
            <div>Total Labor : <Dollor value={totalLabor.toFixed(2)} /></div>
            <div className={"pt-2 border-top mt-2"}>Sub Total: <Dollor value={orderSubTotal.toFixed(2)} /></div>
            <div>Total Tax : <Dollor value={totalTax.toFixed(2)} /></div>
            <div>Total Discount : <Dollor value={totalDiscount.toFixed(2)} /></div>
            <div className={"pt-2 border-top mt-2 grand-total"}>Grand Total : <Dollor value={orderGandTotal.toFixed(2)} /></div>
          </div>
          <div className={"clearfix"}></div>
          </>
          : ''
          }
        </div> 
      </>
    )
  }
}

export default OrderSummary