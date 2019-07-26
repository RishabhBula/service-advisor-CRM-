import React, { Component } from "react";

class DashboardAppointments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={"dashboard-block-container"}>
        {" "}
        <h3>Upcoming Appointments</h3>
        <br />
        Appointments List Here
      </div>
    );
  }
}

export default DashboardAppointments;
