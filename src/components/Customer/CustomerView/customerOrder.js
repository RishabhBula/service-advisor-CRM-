import React, { Component } from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import { serviceTotalsCalculation } from "../../../helpers"
export class CustomerOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleOrderDetails = (orderId) => {
    const orderUrl = "/workflow/order/:id"
    this.props.redirectTo(
      `${orderUrl.replace(
        ":id",
        orderId
      )}`
    );
  }
  render() {
    const { customerOrders } = this.props
    return (
      <>
        <Row>
          {
            customerOrders && customerOrders.length ? customerOrders.map((orders, index) => {
              let serviceCalculation
              const serviceData = orders.serviceId
              if (serviceData && serviceData.length) {
                serviceCalculation = serviceTotalsCalculation(serviceData)
              }
              console.log(serviceCalculation, "serviceCalculation")
              return (
                <Col key={index} md={"12"}>
                  <Card onClick={() => this.handleOrderDetails(orders._id)} className={"customer-order cursor_pointer"}>
                    <CardBody>
                      <Row>
                        <Col md={"3"}>
                          <h5 className={""}><span>({`# ${orders.orderId}`})</span></h5>
                          <div className={"text-left"}>
                            <i className="fa fa-car p-2" />{" "}
                            {orders.vehicleId.make}{" "}{orders.vehicleId.modal}
                          </div>
                          <div className={"text-left"}>
                            <i className="fa fa-user p-2" />{" "}
                            {orders.customerId.firstName}{" "}{orders.customerId.lastName}
                          </div>
                        </Col>
                        <Col md={"3"}>
                          <div className={"pt-5"}>
                            {
                              orders.status ?
                                <span className={"pt-2 pb-0 text-success"}>Authorised{" "} <i className="far fa-check-circle h6" /></span> :
                                <span className={"pt-2 pb-0 text-danger"}>Not Authorised{" "} <i className="far fa-times-circle h6" /></span>
                            }
                          </div>
                        </Col>
                        <Col md={"3"}>
                          <div className={"pt-5"}>
                            {
                              orders.isInvoice ?
                                <h5>Invoices</h5> :
                                <h5>Estimates</h5>
                            }
                          </div>
                        </Col>
                        <Col md={"3"}>
                          <Row>
                            <Col md={"6"}>
                              <div className={"pt-5"}>
                                <h5>${serviceCalculation && serviceCalculation.orderGrandTotal ? parseFloat(serviceCalculation.orderGrandTotal) : "0.00"}</h5>
                              </div>
                              <span>Remaining $0.00</span>
                            </Col>
                            <Col md={"6 text-right"}>
                              <div className={"pt-5"}>
                                <h5 className={"text-success"}>Fully Paid</h5>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              )
            }) : null
          }
        </Row>
      </>
    );
  }
}
