import React, { Component } from "react";
import { Card, CardBody, CardFooter, Row, Col } from "reactstrap";
import VehicleIcons from "../../../containers/Icons/Vehicles"
export class CustomerVehicles extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { customerVehicles } = this.props
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@", customerVehicles);

    return (
      <>
        <Row>
          {
            customerVehicles ? customerVehicles.map((vehicle, index) => {
              return (
                <Col key={index} md={"4"}>
                  <Card>
                    <CardBody className={"d-flex justify-content-center cursor_pointer"}>
                      <div className={"vehicle-details"}></div>
                      <div className={""}>
                        <div>
                          <h5>{vehicle.year}{" "}{vehicle.make}{" "}{vehicle.modal}</h5>
                        </div>
                        <div className={"vehicle-type-img d-inline-block d-flex justify-content-center"}>
                          <VehicleIcons
                            type={vehicle.type.value}
                            color={vehicle.type.color}
                          />
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter></CardFooter>
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
