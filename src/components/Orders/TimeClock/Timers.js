import React, { Component } from "react";
import { logger } from "../../../helpers";
import "./index.scss";
import { Row, Col, Input, Button } from "reactstrap";
import classNames from "classnames";
class Timers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedServices: []
    };
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
  onServiceChange = ({ target }, index) => {
    const { selectedServices } = this.state;
    selectedServices[index] = target.value;
    this.setState({ selectedServices });
  };
  /**
   *
   */
  startTimer = (index, tech, orderId) => {
    const { selectedServices } = this.state;
    const serviceId = selectedServices[index];
    this.props.startTimer({
      serviceId,
      technicianId: tech && tech._id ? tech._id : null,
      orderId
    });
  };
  /**
   *
   */
  stopTimer = (index, tech, orderId) => {
    const { selectedServices } = this.state;
    this.props.stopTimer({
      serviceId: selectedServices[index],
      technicianId: tech && tech._id ? tech._id : null,
      orderId
    });
  };
  /**
   *
   */
  render() {
    let { orderItems, orderId } = this.props;
    if (!orderItems) {
      orderItems = [];
    }
    const technicians = [];
    const services = [];
    orderItems.forEach(service => {
      if (!service.serviceId.technician) {
        service.serviceId.technician = {};
      }
      const ind = technicians.findIndex(
        d => d._id === service.serviceId.technician._id
      );
      if (ind === -1 && service.serviceId.technician._id) {
        technicians.push(service.serviceId.technician);
      }
      services.push(service.serviceId);
    });
    const { selectedServices } = this.state;
    return (
      <>
        <h4>Timers</h4>
        <div className={"timeclock-container"}>
          {technicians && technicians.length && technicians[0] !== null
            ? technicians.map((tech, index) => {
                const technicianServices = services.filter(d =>
                  tech && tech._id ? d.technician._id === tech._id : null
                );
                const isWorking =
                  tech && tech.currentlyWorking && tech.currentlyWorking.orderId
                    ? true
                    : false;
                return (
                  <Row
                    key={index}
                    className={classNames("timeclock-row", {
                      "work-in-progress": isWorking
                    })}
                  >
                    <Col sm={"4"}>
                      <div className={"technician-name"}>
                        {[tech.firstName, tech.lastName].join(" ")}
                      </div>
                    </Col>
                    <Col sm={"4"}>
                      <div className={"service-name-dropdown"}>
                        {!isWorking ? (
                          <Input
                            type="select"
                            value={selectedServices[index]}
                            onChange={e => this.onServiceChange(e, index)}
                          >
                            <option>Select Service</option>
                            {technicianServices.map((service, ind) => {
                              return (
                                <option
                                  key={`${index}-${ind}`}
                                  value={service._id}
                                >
                                  {service.serviceName}
                                </option>
                              );
                            })}
                          </Input>
                        ) : null}
                      </div>
                    </Col>
                    <Col sm={"2"} className={"text-right"}>
                      <div className={"timer-running-time"}>{"--:--"}</div>
                    </Col>
                    <Col sm={"2"} className={"text-right"}>
                      <div className={"clock-button"}>
                        {!isWorking ? (
                          <Button
                            color={"primary"}
                            onClick={() =>
                              this.startTimer(index, tech, orderId)
                            }
                          >
                            Clock In
                          </Button>
                        ) : (
                          <Button
                            color={"primary"}
                            onClick={() => this.stopTimer(index, tech, orderId)}
                          >
                            Clock Out
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                );
              })
            : null}
        </div>
      </>
    );
  }
}

export default Timers;
