import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import Select from "react-select";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import TimeInput from 'react-time-input';
// import CrmTimeMaridonBtn from "../common/CrmTimeMaridonBtn";

export class CrmTimeClockModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      timetype: "AM",
      timeIn: '00:00',
      timeOut: '00:00',
      duration: "0",
      selectedTechnician: {
        label: "Type to select technician",
        value: ""
      },
    };
  }
  onTimeInChangeHandler = (value) => {
    this.setState({
      timeIn: value
    })
    if (this.state.timeOut !== '00:00') {
      this.handleTimeDuration();
    }
  }
  onTimeOutChangeHandler = (value) => {
    this.setState({
      timeOut: value
    })
    if (this.state.timeIn !== '00:00') {
      this.handleTimeDuration();
    }
  }
  handleTimeDuration = () => {
    const { timeIn, timeOut } = this.state;
    var ts1 = moment(`06/26/2019 ${timeIn}`, "M/D/YYYY H:mm").valueOf();
    var ts2 = moment(`06/26/2019 ${timeOut}`, "M/D/YYYY H:mm").valueOf();
    var hours = moment
      .duration(moment(ts2)
        .diff(moment(ts1))
      ).asHours();
    this.setState({
      duration: hours.toFixed(2)
    })
  }
  handleClickTimeType = (value) => {
    this.setState({
      timeType: value
    })
  }
  loadTechnician = (input, callback) => {
    const type = "5ca3473d70537232f13ff1fa"
    this.props.getUserData({ input, type, callback });
  };
  handleTechnicianAdd = (e) => {
    if (e && e.value) {
      this.setState({
        selectedTechnician: {
          label: e.label,
          value: e.value
        }
      })
    } else {
      this.setState({
        selectedTechnician: {
          label: "Type to select technician",
          value: ""
        },
      })
    }
  }
  render() {
    const { openTimeClockModal, handleTimeClockModal, orderReducer } = this.props;
    const { timeIn, timeOut, selectedTechnician } = this.state
    let technicianData = []
    if (orderReducer.orderItems.serviceId && orderReducer.orderItems.serviceId.length) {
      orderReducer.orderItems.serviceId.map((serviceData, index) => {
        if (serviceData.serviceId.technician) {
          technicianData.push({
            label: `${serviceData.serviceId.technician.firstName} ${serviceData.serviceId.technician.lastName}`,
            value: serviceData.serviceId.technician._id
          })
        }
        return true
      })
    }
    return (
      <>
        <Modal
          isOpen={openTimeClockModal}
          toggle={handleTimeClockModal}
          className="customer-modal custom-form-modal modal-lg"
          backdrop={"static"}
        >
          <ModalHeader toggle={handleTimeClockModal}>
            Add Time Manually
          </ModalHeader>
          <ModalBody>
            <Col md="12">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Technician <span className="asteric">*</span>
                </Label>
                <div className={"input-block"}>
                  <Select
                    placeholder={"Type to select technician from the list"}
                    className={"w-100 form-select"}
                    isClearable={selectedTechnician.value !== '' ? true : false}
                    value={selectedTechnician}
                    options={technicianData}
                    onChange={e => this.handleTechnicianAdd(e)}
                    noOptionsMessage={() => "Technician not assigned"}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col md="12">
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Time In <span className="asteric">*</span>
                    </Label>
                    <div className={"input-block"}>
                      <TimeInput
                        initTime={timeIn}
                        ref="TimeInputWrapper"
                        className='form-control'
                        //mountFocus='true'
                        name={"timeIn"}
                        onTimeChange={this.onTimeInChangeHandler}
                      />
                    </div>
                    {/* <CrmTimeMaridonBtn handleClickTimeType={this.handleClickTimeType} timeType={timeType} /> */}
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Time Out <span className="asteric">*</span>
                    </Label>
                    <div className={"input-block"}>
                      <TimeInput
                        initTime={timeOut}
                        ref="TimeInputWrapper"
                        className='form-control'
                        //mountFocus='true'
                        name={"timeOut"}
                        onTimeChange={this.onTimeOutChangeHandler}
                      />
                    </div>
                    {/* <CrmTimeMaridonBtn handleClickTimeType={this.handleClickTimeType} timeType={timeType} /> */}
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Duration <span className="asteric">*</span>
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        name="hourRate"
                        value={this.state.duration}
                        placeholder="0"
                        id="make"
                        disabled
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Activity <span className="asteric">*</span>
                </Label>
                <div className={"input-block"}>
                  <Input
                    value={`Order (#${orderReducer.orderItems.orderId}) ${orderReducer.orderItems.orderName || 'N/A'}`}
                    disabled
                  />
                </div>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Date <span className="asteric">*</span>
                </Label>
                <div className={"input-block"}>
                  <SingleDatePicker
                    date={moment(this.state.date)} // momentPropTypes.momentObj or null
                    onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                    id="Date" // PropTypes.string.isRequired,
                    focused={this.state.focused} // PropTypes.bool
                    onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                  />
                </div>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Notes
                </Label>
                <div className={"input-block"}>
                  <Input type={"textarea"} cols={"10"} rows={"3"} />
                </div>
              </FormGroup>
            </Col>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
              Add Time Logs
            </Button>{" "}
            <Button color="secondary" onClick={handleTimeClockModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
