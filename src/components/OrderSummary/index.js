import React, { Component } from "react";
import {
  Button,
} from "reactstrap";
import moment from "moment";

class OrderSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData:''
    }
  }
  componentDidMount = ()=>{
    this.setState({
      orderData: this.props.orderReducer
    })
  }
  componentDidUpdate = ({ orderReducer}) =>{
    const propData = this.props.orderReducer
    if (propData &&  propData.isOrderLoading !== orderReducer.isOrderLoading ){
      this.setState({
        orderData: this.props.orderReducer
      })
      
    }
  }
  render() {
      const { orderData } = this.state
      const customerInfo = orderData && orderData.orderItems ? orderData.orderItems.customerId : orderData  
      const vehicleInfo  = orderData && orderData.orderItems ? orderData.orderItems.vehicleId : orderData
      const orderID      = orderData && orderData.orderItems ? orderData.orderItems.orderId : orderData
      const createdDate  = orderData && orderData.orderItems ? orderData.orderItems.createdAt : orderData
      const serviceData = orderData && orderData.orderItems ? orderData.orderItems.serviceId : orderData
    console.log(orderData, "orderData of components")
      return (
          <div className={"summary-warp mt-4 mb-2 border"}>
            <div className={"summary-head d-flex flex-column  pt-2 pb-2 border-bottom "}>
            <div className={"d-flex flex-row justify-content-between"}>
              <h5 className={"mb-0"}>Order ID #{orderID || ''}</h5>
                <div>
                  <Button color={"warning"} className={"mr-1"} size={"sm"}>Send Message</Button>
                  <Button color={"success"} className={"mr-1"} size={"sm"}>Authorize</Button>
                  <Button color={"primary"} className={"mr-1"} size={"sm"}>More Options</Button>
                </div>
              </div>
              <div>
              <h4>{orderData && orderData.orderItems ? orderData.orderItems.orderName : ''}</h4>
              </div>
            </div>
            <div className={"company-info-head d-flex flex-row justify-content-between pt-1 pb-1 border-bottom align-items-center"}>
              <h4>D-company</h4>
            <div>Created Date: {moment(createdDate || '').format("MMM Do YYYY")}</div>
            </div>
            <div className={"user-info d-flex justify-content-between pt-2 pb-2"}>
              <div className={"border-right w-50"}>
              { customerInfo ? <>
                <h4>{customerInfo.firstName}</h4> 
                <div>{customerInfo ? customerInfo.email : ''}</div>
                </>
                :''
              }
              </div>
              <div className={"w-50 pl-3"}>
              {vehicleInfo ? <h4>{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.modal}</h4>: ''}
              </div>
            </div>

            <div className={"service-warp border-top"}>
            {serviceData && serviceData.length ? serviceData.map((ele ,index)=>{
              return(
                <div key={index} className={"bg-light mb-2 mt-2 p-2"}>
                  <h4>{ele.serviceId.serviceName}</h4>
                  {ele.serviceId.serviceItems && ele.serviceId.serviceItems.length ? ele.serviceId.serviceItems.map((serviceItemele, itemindex) => {
                    return(
                      <div key={itemindex} className={"pb-2 border-bottom"}>
                        <div>{serviceItemele.description || serviceItemele.brandName}</div>
                        <div className={"d-flex "}>
                          <span className={"pr-3"}>QTY : {serviceItemele.quantity}</span>
                          <span>Discount : {serviceItemele.discount.value || 0}{serviceItemele.discount.type}</span>
                          <span className={"pull-right ml-auto"}>Sub Total : ${serviceItemele.subTotalValue}</span>
                        </div>
                      </div>
                    )
                  })
                  : ''
                }
                  <div className={"d-flex justify-content-end"}>
                    <div>Discount : {ele.serviceId.discount.value || 0} {ele.serviceId.discount.type}</div>
                    <div className={"w-25 text-right"}>Total : ${ele.serviceId.serviceTotal}</div>
                  </div>
                </div>
              )
            })
            : ''
          }
            </div>
          </div>
      )
  }
}

 export default OrderSummary