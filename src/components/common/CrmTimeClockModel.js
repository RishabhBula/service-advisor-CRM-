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
  Row,
  FormFeedback
} from "reactstrap";
import Select from "react-select";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import TimeInput from 'react-time-input';
import * as classnames from "classnames";
import { calculateDurationFromSeconds } from "../../helpers/Sum"
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
      technicianData: "",
      notes: "",
      isError: false,
      isEditTimeClock: false
    };
  }
  componentDidUpdate = ({ timeLogEle }) => {
    if (timeLogEle !== this.props.timeLogEle) {
      console.log("########################", this.props.timeLogEle);
      const {
        date,
        startDateTime,
        endDateTime,
        duration,
        technicianId,
      } = this.props.timeLogEle
      const startDateTime1 = moment(startDateTime).format("HH:mm")
      const endDateTime1 = moment(endDateTime).format("HH:mm")
      const calDuration = calculateDurationFromSeconds(duration)
      this.setState({
        date,
        timeIn: startDateTime1,
        timeOut: endDateTime1,
        duration: calDuration,
        technicianData: technicianId,
        selectedTechnician: {
          label: technicianId ? `${technicianId.firstName} ${technicianId.lastName}` : "Type to select technician",
          value: technicianId ? technicianId._id : ""
        },
        isEditTimeClock: true
      })
    }
  }

  onTimeInChangeHandler = (value) => {
    this.setState({
      timeIn: value
    });
    if (this.state.timeOut !== "00:00") {
      this.handleTimeDuration();
    }
  };
  onTimeOutChangeHandler = value => {
    this.setState({
      timeOut: value
    });
    if (this.state.timeIn !== "00:00") {
      this.handleTimeDuration();
    }
  }
  handleChange = e => {
    const { value } = e.target;
    this.setState({
      notes: value
    })
  }
  handleTimeDuration = () => {
    const { timeIn, timeOut } = this.state;
    var ts1 = moment(`06/26/2019 ${timeIn}`, "M/D/YYYY HH:mm").valueOf();
    var ts2 = moment(`06/26/2019 ${timeOut}`, "M/D/YYYY HH:mm").valueOf();
    var Seconds = moment
      .duration(moment(ts2)
        .diff(moment(ts1))
      ).asSeconds()
    const duration = calculateDurationFromSeconds(Seconds)

    this.setState({
      duration: duration
    })
  }
  handleClickTimeType = (value) => {
    this.setState({
      timeType: value
    })
  }
  handleTechnicianAdd = (e) => {
    if (e && e.value) {
      this.setState({
        selectedTechnician: {
          label: e.label,
          value: e.value
        },
        technicianData: e.technician
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
  handleAddTimeLogs = () => {
    const { selectedTechnician, timeIn, timeOut, duration, technicianData, date, notes } = this.state
    if (!timeIn || !timeOut || !duration || !selectedTechnician.value) {
      this.setState({
        isError: true
      })
      return
    } else {
      const { orderReducer, timeLogEle } = this.props
      const totalValue = parseFloat(duration) * parseFloat(technicianData.rate)
      const payload = {
        type: "Manual",
        technicianId: selectedTechnician.value,
        startDateTime: timeIn,
        endDateTime: timeOut,
        activity: `Order (#${orderReducer.orderItems.orderId}) ${orderReducer.orderItems.orderName || 'N/A'}`,
        duration: duration,
        date: date,
        orderId: orderReducer.orderItems._id,
        total: totalValue || "0",
        notes: notes,
        _id: timeLogEle ? timeLogEle._id : null
      }
      if (this.state.isEditTimeClock) {
        this.props.editTimeLogRequest(payload)
      } else {
        this.props.addTimeLogRequest(payload)
      }
    }
  }
  render() {
    const { openTimeClockModal, handleTimeClockModal, orderReducer } = this.props;
    const { timeIn, timeOut, selectedTechnician, duration, isError, isEditTimeClock, notes } = this.state
    let technicianData = []
    if (orderReducer.orderItems.serviceId && orderReducer.orderItems.serviceId.length) {
      orderReducer.orderItems.serviceId.map((serviceData, index) => {
        if (serviceData.serviceId.technician && serviceData.serviceId.technician._id) {
          technicianData.push({
            label: `${serviceData.serviceId.technician.firstName} ${serviceData.serviceId.technician.lastName}`,
            value: serviceData.serviceId.technician._id,
            technician: serviceData.serviceId.technician
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
            {
              isEditTimeClock ? "Edit Time Logs" : "Add Time Manually"
            }
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
                    className={classnames("w-100 form-select", {
                      "is-invalid":
                        isError && !selectedTechnician.value
                    })}
                    isClearable={selectedTechnician.value !== '' ? true : false}
                    value={selectedTechnician}
                    options={technicianData}
                    onChange={e => this.handleTechnicianAdd(e)}
                    noOptionsMessage={() => "Technician not assigned"}
                  />
                  {
                    isError && !selectedTechnician.value ?
                      <FormFeedback>Technician is required</FormFeedback> :
                      null
                  }
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
                        className={classnames("form-control", {
                          "is-invalid":
                            isError && !timeIn
                        })}
                        //mountFocus='true'
                        name={"timeIn"}
                        onTimeChange={this.onTimeInChangeHandler}
                      />
                      {
                        isError && !timeIn ?
                          <FormFeedback>Time in is required</FormFeedback> :
                          null
                      }
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
                        className={classnames("form-control", {
                          "is-invalid":
                            isError && !timeOut
                        })}
                        //mountFocus='true'
                        name={"timeOut"}
                        onTimeChange={this.onTimeOutChangeHandler}
                      />
                      {
                        isError && !timeOut ?
                          <FormFeedback>Time out is required</FormFeedback> :
                          null
                      }
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
                        value={duration}
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
                  <Input value={notes} onChange={this.handleChange} type={"textarea"} cols={"10"} rows={"3"} />
                </div>
              </FormGroup>
            </Col>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleAddTimeLogs}>
              {isEditTimeClock ? "Edit Time Log" : "Add Time Log"}
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
