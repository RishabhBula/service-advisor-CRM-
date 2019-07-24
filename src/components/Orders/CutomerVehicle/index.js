import React, { Component } from "react";
import { Col, Row, FormGroup, Label, FormFeedback, Button } from "reactstrap";
import Async from "react-select/lib/Async";
import * as classnames from "classnames";
import serviceUser from "../../../assets/service-user.png";
import serviceTyre from "../../../assets/service-car.png";

class CutomerVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: "",
      vehicleId: "",
      selectedCustomer: {
        lable: "Type to select customer",
        value: ""
      },
      selectedVehicle: {
        lable: "Type to select vehicle",
        value: ""
      },
      customerInput: "",
      vehicleInput: ""
    };
  }
  componentDidUpdate = ({ orderReducer }) => {
    if (orderReducer.orderItems !== this.props.orderReducer.orderItems) {
      if (
        this.props.orderReducer.orderItems.customerId ||
        this.props.orderReducer.orderItems.vehicleId
      ) {
        const { customerId, vehicleId } = this.props.orderReducer.orderItems;
        this.setState({
          customerId,
          vehicleId,
          selectedCustomer: {
            label: customerId
              ? `${customerId.firstName} ${customerId.lastName}`
              : "Type to select customer",
            value: customerId ? customerId._id : ""
          },
          selectedVehicle: {
            label: vehicleId
              ? `${vehicleId.make} ${vehicleId.modal}`
              : "Type to select vehicle",
            value: vehicleId ? vehicleId._id : ""
          }
        });
      }
    }
  };
  loadCustomers = (input, callback) => {
    this.setState({
      customerInput: input.length > 1 ? input : null 
    })
    this.props.getCustomerData({ input, callback });
  };
  loadVehicles = (input, callback) => {
    this.setState({
      vehicleInput: input.length > 1 ? input : null
    })
    this.props.getVehicleData({ input, callback });
  };
  handaleCustomerSelect = (e, name) => {
    const { customerId, vehicleId } = this.state;
    if (e && e.value && name === "customer") {
      this.setState(
        {
          customerId: e
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId);
        }
      );
    } else {
      this.setState(
        {
          customerId: "",
          selectedCustomer: {
            lable: "Type to select customer",
            value: ""
          }
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId);
        }
      );
    }
  };
  handaleVehicleSelect = (e, name) => {
    const { customerId, vehicleId } = this.state;
    if (e && e.value && name === "vehicle") {
      this.setState(
        {
          vehicleId: e
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId);
        }
      );
    } else {
      this.setState(
        {
          vehicleId: "",
          selectedVehicle: {
            lable: "Type to select vehicle",
            value: ""
          }
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId);
        }
      );
    }
  };
  render() {
    const {
      selectedCustomer,
      selectedVehicle,
      customerId,
      vehicleId
    } = this.state;
    const { isError } = this.props;
    return (
      <Row className={"custom-form-modal"}>
        <Col md={"5"}>
          <FormGroup>
            <Label htmlFor="name" className="customer-modal-text-style">
              <span className={"label-block "}>
                <img
                  src={serviceUser}
                  alt={"serviceUser"}
                  width={"34"}
                  height={"34"}
                />
                <span className={"label-text position-relative"}>
                  Customer <span className={"asteric"}>*</span>
                </span>
              </span>
            </Label>
            <div className={"input-block"}>
              <Async
                placeholder={"Type Customer name"}
                loadOptions={this.loadCustomers}
                value={
                  selectedCustomer.value !== "" ? selectedCustomer : customerId
                }
                isClearable={true}
                className={classnames("w-100 form-select", {
                  "is-invalid": isError && !customerId
                })}
                noOptionsMessage={() => this.state.customerInput ? "No customer found" : "Type customer name"}
                onChange={e => {
                  this.setState(
                    {
                      customerId: e
                    },
                    () => {
                      this.handaleCustomerSelect(e, "customer");
                    }
                  );
                }}
              />
              {isError && !customerId ? (
                <FormFeedback>Customer data is required.</FormFeedback>
              ) : null}
            </div>
          </FormGroup>
        </Col>
        <Col md={"5"}>
          <FormGroup>
            <Label htmlFor="name" className="customer-modal-text-style">
              <span className={"label-block"}>
                <img
                  src={serviceTyre}
                  alt={"serviceUser"}
                  width={"34"}
                  height={"34"}
                />
                <span className={"label-text position-relative"}>
                  Vehicle <span className={"asteric"}>*</span>
                </span>
              </span>
            </Label>
            <div className={"input-block"}>
              <Async
                placeholder={"Type Vehicle name"}
                loadOptions={this.loadVehicles}
                className={classnames("w-100 form-select", {
                  "is-invalid": isError && !vehicleId
                })}
                value={
                  selectedVehicle.value !== "" ? selectedVehicle : vehicleId
                }
                isClearable={true}
                noOptionsMessage={() => this.state.vehicleInput ? "No vehicle found" : "Type vehicle name"}
                onChange={e => {
                  this.setState(
                    {
                      vehicleId: e
                    },
                    () => {
                      this.handaleVehicleSelect(e, "vehicle");
                    }
                  );
                }}
              />
              {isError && !vehicleId ? (
                <FormFeedback>Vehicle data is required.</FormFeedback>
              ) : null}
            </div>
          </FormGroup>
        </Col>
        <Col md={"2"}>
          <Button
            color={"secondary"}
            size={"sm"}
            className={"mt-1"}
            onClick={this.props.handleEditOrder}
          >
            Update Order
          </Button>
        </Col>
      </Row>
    );
  }
}

export default CutomerVehicle;
