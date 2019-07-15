import TimeInput from "react-time-input";

import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  FormFeedback,
  Input
} from "reactstrap";
import Async from "react-select/lib/Async";
import classnames from "classnames";
import DayPicker from "react-day-picker";
import React, { Component } from "react";

import { logger } from "../../helpers";
import CRMModal from "../common/Modal";
import moment from "moment";
import { AppointmentColors } from "../../config/Constants";

export default class AddAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: "",
      appointmentDate: this.props.date || new Date(),
      errors: {},
      selectedCustomer: null,
      selectedVehicle: null,
      startTime: moment().format("HH:mm"),
      endTime: moment()
        .add(1, "hour")
        .format("HH:mm"),
      appointmentTitle: "",
      note: "",
      selectedColor: ""
    };
  }
  /**
   *
   */
  componentDidUpdate({ date: prevDate }) {
    const { date } = this.props;
    if (date !== prevDate) {
      this.setState({
        appointmentDate: date
      });
    }
  }
  /**
   *
   */
  handleInputChange = e => {
    logger(e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  /**
   *
   */
  onDayChange = appointmentDate => {
    logger(appointmentDate);
    this.setState({
      appointmentDate
    });
  };
  /**
   *
   */
  loadCustomers = (input, callback) => {
    this.props.getCustomerData({ input, callback });
  };
  /**
   *
   */
  loadVehicles = (input, callback) => {
    const { selectedCustomer } = this.state;
    if (!selectedCustomer) {
      return callback([]);
    }

    this.props.getVehicleData({
      input,
      callback,
      customerId: selectedCustomer.value
    });
  };
  /**
   *
   */
  onTimeChange = (time, type) => {
    this.setState({
      [type]: time
    });
  };
  /**
   *
   */
  resetState = () => {
    this.setState({
      customerId: "",
      appointmentDate: this.props.date || new Date(),
      errors: {},
      selectedCustomer: null,
      selectedVehicle: null,
      startTime: moment().format("HH:mm"),
      endTime: moment()
        .add(1, "hour")
        .format("HH:mm"),
      appointmentTitle: "",
      note: "",
      selectedColor: ""
    });
  };
  /**
   *
   */
  render() {
    const {
      selectedCustomer,
      appointmentDate,
      errors,
      selectedVehicle,
      startTime,
      endTime,
      appointmentTitle,
      note,
      selectedColor
    } = this.state;
    const { toggleAddAppointModal, isOpen, isEditMode } = this.props;
    const headerText = isEditMode
      ? "Update Appointment Details"
      : "Add Appointment Details";
    const buttons = [
      {
        text: isEditMode ? "Update Appointment" : "Add Appointment",
        color: "primary",
        type: "submit"
      },
      {
        text: "Cancel",
        onClick: toggleAddAppointModal,
        type: "button"
      }
    ];
    return (
      <Form
        onSubmit={this.addPart}
        className={classnames("add-appointment-form")}
      >
        <CRMModal
          isOpen={isOpen}
          toggle={e => {
            this.resetState();
            toggleAddAppointModal(e);
          }}
          headerText={headerText}
          footerButtons={buttons}
        >
          <Row>
            <Col sm={"12"}>
              <Label className={"float-left"}>Appointment Label</Label>
              <div>
                {AppointmentColors.map((color, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: color.value
                      }}
                      className={classnames("appointment-colors", {
                        selected:
                          selectedColor === color.value ||
                          (!selectedColor && index === 0)
                      })}
                      onClick={() =>
                        this.setState({
                          selectedColor: color.value
                        })
                      }
                    >
                      {selectedColor === color.value ||
                      (!selectedColor && index === 0) ? (
                        <i className={"fa fa-check text-white"} />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Col>
            <Col sm={"8"}>
              <Row>
                <Col sm={"6"}>
                  <DayPicker
                    selectedDays={appointmentDate}
                    onDayClick={this.onDayChange}
                    disabledDays={{
                      before: new Date()
                    }}
                  />
                </Col>
                <Col sm={"6"}>
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Title <span className={"asteric"}>*</span>
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        placeholder="John"
                        name="appointmentTitle"
                        onChange={this.handleInputChange}
                        value={appointmentTitle}
                        maxLength="30"
                        invalid={errors.appointmentTitle}
                      />
                      {errors.appointmentTitle ? (
                        <FormFeedback>{errors.appointmentTitle}</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Start Time <span className="asteric">*</span>
                    </Label>
                    <div className={"input-block"}>
                      <TimeInput
                        initTime={startTime}
                        ref="TimeInputWrapper"
                        className={classnames("form-control", {
                          "is-invalid": errors.startTime
                        })}
                        placeholder={"__:__"}
                        name={"startTime"}
                        onTimeChange={e => this.onTimeChange(e, "startTime")}
                      />
                      {errors.startTime ? (
                        <FormFeedback>Start time is required</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      End Time <span className="asteric">*</span>
                    </Label>
                    <div className={"input-block"}>
                      <TimeInput
                        initTime={endTime}
                        ref="TimeInputWrapper"
                        className={classnames("form-control", {
                          "is-invalid": errors.endTime
                        })}
                        name={"endTime"}
                        onTimeChange={e => this.onTimeChange(e, "endTime")}
                        disabled={!startTime}
                        placeholder={"__:__"}
                      />
                      {errors.endTime ? (
                        <FormFeedback>End time is required</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Notes
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="textarea"
                        className={classnames("form-control", {
                          "is-invalid": errors.note
                        })}
                        name={"note"}
                        value={note}
                        onChange={this.handleInputChange}
                        placeholder={"Note"}
                      />
                      {errors.note ? (
                        <FormFeedback>{errors.note}</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
                <Col sm={"12"}>
                  <FormGroup className={"fleet-block"}>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Customer
                    </Label>
                    <div className={"input-block"}>
                      <Async
                        placeholder={"Type to select customer from the list"}
                        loadOptions={this.loadCustomers}
                        className={classnames("w-100 form-select", {
                          "is-invalid": errors.selectedCustomer
                        })}
                        value={selectedCustomer}
                        onChange={e => {
                          this.setState({
                            selectedCustomer: e
                          });
                        }}
                        isClearable={true}
                        noOptionsMessage={() => "No customer found"}
                      />
                      {errors.selectedCustomer ? (
                        <FormFeedback>{errors.selectedCustomer}</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Vehicle
                    </Label>
                    <div className={"input-block"}>
                      <Async
                        placeholder={"Type Vehicle name"}
                        loadOptions={this.loadVehicles}
                        className={classnames("w-100 form-select", {
                          "is-invalid": errors.selectedVehicle
                        })}
                        value={selectedVehicle}
                        isClearable={true}
                        noOptionsMessage={() => "No vehicle found"}
                        onChange={e => {
                          this.setState({
                            selectedVehicle: e
                          });
                        }}
                      />
                      {errors.selectedVehicle ? (
                        <FormFeedback>{errors.selectedVehicle}</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Phone Number
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        className={classnames("form-control", {
                          "is-invalid": errors.phone
                        })}
                        name={"phone"}
                        value={note}
                        placeholder={"Phone"}
                        onChange={this.handleInputChange}
                      />
                      {errors.phone ? (
                        <FormFeedback>{errors.phone}</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Email
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="email"
                        className={classnames("form-control", {
                          "is-invalid": errors.phone
                        })}
                        name={"email"}
                        value={note}
                        placeholder={"Email"}
                        onChange={this.handleInputChange}
                      />
                      {errors.phone ? (
                        <FormFeedback>{errors.phone}</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Select Order
                    </Label>
                    <div className={"input-block"}>
                      <Async
                        placeholder={"Type Vehicle name"}
                        loadOptions={this.loadVehicles}
                        className={classnames("w-100 form-select", {
                          "is-invalid": errors.selectedVehicle
                        })}
                        value={selectedVehicle}
                        isClearable={true}
                        noOptionsMessage={() => "No vehicle found"}
                        onChange={e => {
                          this.setState({
                            selectedVehicle: e
                          });
                        }}
                      />
                      {errors.selectedVehicle ? (
                        <FormFeedback>{errors.selectedVehicle}</FormFeedback>
                      ) : null}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col sm={"4"} />
          </Row>
        </CRMModal>
      </Form>
    );
  }
}
