import React, { Component } from "react";
import { Col, Row, FormGroup, Label, FormFeedback, Button } from "reactstrap";
import Async from "react-select/lib/Async";
import * as classnames from "classnames";
import serviceUser from "../../../assets/service-user.png";
import serviceTyre from "../../../assets/service-car.png";
import { CrmCustomerModal } from "../../common/CrmCustomerModal";
import { CrmVehicleModal } from "../../common/Vehicles/CrmVehicleModal";
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
      vehicleInput: "",
      isCustomerVehicleUpdate: false
    };
  }
  /*
  /*  
  */
  componentDidMount = () => {
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
  /*
  /*  
  */
  componentDidUpdate = ({ orderReducer, customerInfoReducer, vehicleAddInfoReducer }) => {
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
    if (customerInfoReducer.customerAddInfo !== this.props.customerInfoReducer.customerAddInfo) {
      const customerId = this.props.customerInfoReducer.customerAddInfo
      this.setState({
        customerId,
        selectedCustomer: {
          label: customerId
            ? `${customerId.firstName} ${customerId.lastName}`
            : "Type to select customer",
          value: customerId ? customerId._id : ""
        }
      });
      this.props.customerVehicleData(customerId, this.state.vehicleId, true);
    }
    if (vehicleAddInfoReducer.vehicleAddInfo !== this.props.vehicleAddInfoReducer.vehicleAddInfo) {
      const vehicleId = this.props.vehicleAddInfoReducer.vehicleAddInfo
      this.setState({
        vehicleId,
        selectedVehicle: {
          label: vehicleId
            ? `${vehicleId.make} ${vehicleId.modal}`
            : "Type to select vehicle",
          value: vehicleId ? vehicleId._id : ""
        }
      });
      this.props.customerVehicleData(this.state.customerId, vehicleId, true);
    }
  };
  /*
  /*  
  */
  loadCustomers = (input, callback) => {
    this.setState({
      customerInput: input.length > 1 ? input : null
    })
    this.props.getCustomerData({ input, callback });
  };
  /*
  /*  
  */
  loadVehicles = (input, callback) => {
    this.setState({
      vehicleInput: input.length > 1 ? input : null
    })
    this.props.getVehicleData({ input, callback });
  };
  /*
  /*  
  */
  handaleCustomerSelect = (e, name) => {
    const { customerId, vehicleId, isCustomerVehicleUpdate } = this.state;
    if (e && e.label === "+ Add New Customer") {
      this.handleCustomerModel()
    }
    if (e && e.value && name === "customer") {
      this.setState(
        {
          customerId: e,
          selectedCustomer: {
            label: e.label,
            value: e.value,
          },
          isCustomerVehicleUpdate: true
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId, isCustomerVehicleUpdate);
        }
      );
    } else {
      this.setState(
        {
          customerId: "",
          selectedCustomer: {
            label: "Type to select customer",
            value: ""
          },
          isCustomerVehicleUpdate: false
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId, isCustomerVehicleUpdate);
        }
      );
    }
  };
  /*
  /*  
  */
  handaleVehicleSelect = (e, name) => {
    const { customerId, vehicleId, isCustomerVehicleUpdate } = this.state;
    if (e && e.label === "+ Add New Vehicle") {
      this.handleVehicleModel()
    }
    if (e && e.value && name === "vehicle") {
      this.setState(
        {
          vehicleId: e,
          selectedVehicle: {
            label: e.label,
            value: e.value
          },
          isCustomerVehicleUpdate: true
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId, isCustomerVehicleUpdate);
        }
      );
    } else {
      this.setState(
        {
          vehicleId: "",
          selectedVehicle: {
            label: "Type to select vehicle",
            value: ""
          },
          isCustomerVehicleUpdate: false
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId, isCustomerVehicleUpdate);
        }
      );
    }
  };
  /*
  /*  
  */
  handleCustomerModel = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      customerModel: !modelDetails.customerModel,
      customerEditModel: false
    };
    this.props.modelOperate(data);
  }
  /*
  /*  
  */
  handleCustomerCreate = (data) => {
    const payload = {
      ...data,
      workFlowCustomer: true
    }
    this.props.addCustomer(payload)
  }
  /*
  /*  
  */
  handleVehicleModel = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: !modelDetails.vehicleModel,
      vehicleEditModel: false
    };
    this.props.modelOperate(data);
  }
  /*
  /*  
  */
  handleVehicleCreate = (data) => {
    const payload = {
      ...data,
      workFlowVehicle: true
    }
    this.props.addVehicle(payload)
  }
  /*
  /*  
  */
  render() {
    const {
      selectedCustomer,
      selectedVehicle,
      customerId,
      vehicleId,
    } = this.state;
    const { isError, customerFleetReducer } = this.props;
    const { modelDetails } = this.props.modelInfoReducer;
    return (
      <>
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
                    )
                  }
                  }
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
            <div id={`orderUpdated`}>
              <Button
                color={"secondary"}
                size={""}
                onClick={this.props.handleEditOrder}
              >
                Update Order
          </Button>
            </div>
          </Col>
        </Row>
        <CrmCustomerModal
          customerModalOpen={modelDetails.customerModel}
          handleCustomerModalFun={this.handleCustomerModel}
          addCustomerFun={this.handleCustomerCreate}
          profileInfo={this.props.profileInfoReducer}
          editMode={false}
          customer={""}
          getCustomerFleetList={customerFleetReducer.customerFleetData}
        />
        <CrmVehicleModal
          vehicleModalOpen={modelDetails.vehicleModel}
          handleVehicleModal={this.handleVehicleModel}
          submitCreateVehicleFun={this.handleVehicleCreate}
        />
      </>
    );
  }
}

export default CutomerVehicle;
