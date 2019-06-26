import React, { Component } from "react";
import { logger } from "../../../helpers";
import "./index.scss";
import { Row, Col, Input, Button } from "reactstrap";
class Timers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   *
   */
  componentDidMount() {
    logger(this.props);
  }
  /**
   *
   */
  render() {
    let { orderItems } = this.props;
    if (!orderItems) {
      orderItems = [];
    }
    const technicians = [];
    const services = [];
    orderItems.forEach(service => {
      const ind = technicians.findIndex(
        d => d._id === service.serviceId.technician._id
      );
      // logger(ind, service.serviceId.technician._id);
      if (ind === -1) {
        technicians.push(service.serviceId.technician);
      }
      services.push(service.serviceId);
    });
    return (
      <div>
        <h4>Timers</h4>
        <div className={"timeclock-container"}>
          {technicians && technicians.length && technicians[0] !== null ? technicians.map((tech, index) => {
            const technicianServices = services.filter(
              d => tech && tech._id ? d.technician._id === tech._id : null
            );
            return (
              <Row key={index} className={"timeclock-row"}>
                <Col sm={"4"}>
                  <div className={"technician-name"}>
                    {[tech.firstName, tech.lastName].join(" ")}
                  </div>
                </Col>
                <Col sm={"4"}>
                  <div className={"service-name-dropdown"}>
                    <Input type="select">
                      <option>Select Service</option>
                      {technicianServices.map((service, ind) => {
                        return (
                          <option key={`${index}-${ind}`}>
                            {service.serviceName}
                          </option>
                        );
                      })}
                    </Input>
                  </div>
                </Col>
                <Col sm={"2"} className={"text-right"}>
                  <div className={"timer-running-time"}>{"--:--"}</div>
                </Col>
                <Col sm={"2"} className={"text-right"}>
                  <div className={"clock-button"}>
                    <Button color={"primary"}>Clock In</Button>
                  </div>
                </Col>
              </Row>
            );
          }) : null
          }
        </div>
      </div>
    );
  }
}

export default Timers;
