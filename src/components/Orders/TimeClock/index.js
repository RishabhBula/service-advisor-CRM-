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
    const { modelInfoReducer, orderId, orderItems } = this.props;
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
