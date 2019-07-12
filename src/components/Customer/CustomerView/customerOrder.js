import React, { Component } from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
export class CustomerOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { customerOrders } = this.props
    return (
      <>
        <Row>
          {
            customerOrders && customerOrders.length ? customerOrders.map((orders, index) => {
              return (
                <Col key={index} md={"12"}>
                  <Card>
                    <CardBody>
                      <div>
                        <span>({`# ${orders.orderId}`})</span>
                      </div>
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
