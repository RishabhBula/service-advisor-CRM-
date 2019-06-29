import React, { Component } from "react";
import TimeLogList from "./timeLogList";
import { CrmTimeClockModal } from "../../common/CrmTimeClockModel";
import Timers from "./Timers";
class TimeClock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   *
   */
  handleTimeClockModal = () => {
    const { modelInfoReducer, modelOperate } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockModalOpen } = modelDetails;
    modelOperate({
      timeClockModalOpen: !timeClockModalOpen
    });
  };
  /**
   *
   */
  render() {
    const {
      modelInfoReducer,
      modelOperate,
      orderId,
      orderItems,
      getUserData,
      orderReducer,
      editTimeLogRequest,
      addTimeLogRequest,
      timelogReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockModalOpen } = modelDetails;
    return (
      <div>
        <Timers orderId={orderId} orderItems={orderItems.serviceId} />
        <span
          className={"text-primary cursor_pointer"}
          onClick={this.handleTimeClockModal}
        >
          Add Time Manually
        </span>
        <TimeLogList
          timeLogData={timelogReducer.timeLogData}
          handleTimeClockModal={this.handleTimeClockModal}
          getUserData={getUserData}
          orderReducer={orderReducer}
          editTimeLogRequest={editTimeLogRequest}
          modelOperate={modelOperate}
          modelInfoReducer={modelInfoReducer}
          timeClockModalOpen={timeClockModalOpen}
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

export default TimeClock;
