import React, { Component } from "react";
import {
  Button
} from "reactstrap";
import { connect } from "react-redux";
import * as qs from "query-string";
import TechnicianTimer from "../../components/TimeClock/technicianTimer";
import { CrmTimeClockModal } from "../../components/common/CrmTimeClockModel";
import {
  modelOpenRequest,
  getUsersList,
  addTimeLogRequest,
  updateTimeLogRequest,
  startTimer,
  stopTimer,
  getOrderDetailsRequest,
  getAllServiceListRequest,
  isTimeClockStart,
  getAllTimeLogRequest,
} from "../../actions"
import TimeLogList from "../../components/TimeClock/timeLogList";
import { isEqual } from "../../helpers/Object";

class TimeClocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    this.props.getUserData({ page: 1 })
    const currQuery = qs.parse(this.props.location.search);
    this.props.getAllTimeLogRequest({ ...currQuery, page: currQuery.page || 1 });
  }
  componentDidUpdate = ({ userReducer, location }) => {
    const userData = this.props.userReducer.users
    if ((userReducer.users !== userData) && (userData.length) && (userData[0].currentlyWorking)) {
      const orderId = userData[0].currentlyWorking && userData[0].currentlyWorking.orderId ? userData[0].currentlyWorking.orderId._id : null
      this.props.getAllServiceListRequest()
      if (userData[0].currentlyWorking.orderId && userData[0].currentlyWorking.orderId._id) {
        this.props.getOrderDetailsRequest({ _id: orderId })
      }
    }
    if (location) {
      const prevQuery = qs.parse(location.search);
      const currQuery = qs.parse(this.props.location.search);
      if (!isEqual(prevQuery, currQuery)) {
        this.props.getAllTimeLogRequest({ ...currQuery, page: currQuery.page || 1 });
      }
    }
  }
  handleTimeClockModal = () => {
    const { modelInfoReducer, modelOperate } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockModalOpen } = modelDetails;
    modelOperate({
      timeClockModalOpen: !timeClockModalOpen
    });
  };

  render() {
    const {
      modelInfoReducer,
      getUserData,
      orderReducer,
      addTimeLogRequest,
      userReducer,
      startTimer,
      stopTimer,
      serviceReducers,
      isTimeClockStart,
      timelogReducer,
      updateTimeLogRequest
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockModalOpen } = modelDetails;
    return (
      <div className={"pl-3"}>
        <div className={"d-flex justify-content-between"}>
          <h3 className={"pb-2"}>Time Clocks</h3>
          <div className={"pr-2"}>
            <Button onClick={this.handleTimeClockModal} className={"btn-theme btn btn-round"}>+ Add Time Manually</Button>
          </div>
        </div>
        <TechnicianTimer
          userReducer={userReducer}
          startTimer={startTimer}
          stopTimer={stopTimer}
          serviceData={serviceReducers.serviceDataList}
          isTimeClockStart={isTimeClockStart}
        />
        <TimeLogList
          timeLogData={timelogReducer.allTimeData}
          totalDuration={timelogReducer.totalDuration}
          totalTimeLogs={timelogReducer.totalTimeLogs}
          handleTimeClockModal={this.handleTimeClockModal}
          getUserData={getUserData}
          orderReducer={orderReducer}
          modelInfoReducer={modelInfoReducer}
          isSuccess={timelogReducer.isSuccess}
          editTimeLogRequest={updateTimeLogRequest}
          {...this.props}
        />
        <CrmTimeClockModal
          openTimeClockModal={timeClockModalOpen}
          getUserData={getUserData}
          orderReducer={orderReducer}
          handleTimeClockModal={this.handleTimeClockModal}
          addTimeLogRequest={addTimeLogRequest}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  modelInfoReducer: state.modelInfoReducer,
  orderReducer: state.orderReducer,
  timelogReducer: state.timelogReducer,
  userReducer: state.usersReducer,
  serviceReducers: state.serviceReducers,
});

const mapDispatchToProps = dispatch => ({
  modelOperate: data => dispatch(modelOpenRequest({ modelDetails: data })),
  getUserData: data => dispatch(getUsersList(data)),
  addTimeLogRequest: data => dispatch(addTimeLogRequest(data)),
  updateTimeLogRequest: data => dispatch(updateTimeLogRequest(data)),
  startTimer: data => dispatch(startTimer(data)),
  stopTimer: data => dispatch(stopTimer(data)),
  getOrderDetailsRequest: data => dispatch(getOrderDetailsRequest(data)),
  getAllServiceListRequest: data => dispatch(getAllServiceListRequest(data)),
  isTimeClockStart: data => dispatch(isTimeClockStart(data)),
  getAllTimeLogRequest: (data) => dispatch(getAllTimeLogRequest(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeClocks);