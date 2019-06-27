import React, { Component } from "react";

import { CrmTimeClockModal } from "../../common/CrmTimeClockModel";
import TimeLogList from "./timeLogList";
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
      orderId,
      orderItems,
      startTimer,
      stopTimer
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockModalOpen } = modelDetails;
    return (
      <div>
        <Timers
          orderId={orderId}
          orderItems={orderItems.serviceId}
          startTimer={startTimer}
          stopTimer={stopTimer}
        />
        <span
          className={"text-primary cursor_pointer"}
          onClick={this.handleTimeClockModal}
        >
          Add Time Manually
        </span>
        <TimeLogList />
        <CrmTimeClockModal
          openTimeClockModal={timeClockModalOpen}
          handleTimeClockModal={this.handleTimeClockModal}
        />
      </div>
    );
  }
}

export default TimeClock;
