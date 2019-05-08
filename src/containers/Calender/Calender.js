import React, { Component } from "react";

import { connect } from "react-redux";
import {
  Card,
  CardBody,
  Button,
  UncontrolledTooltip,
} from "reactstrap";

import Appointments from "../../components/Appointments";
import CrmCircleIcon from "../../components/common/CrmCircleIcon";

class Calender extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Card className="white-card position-relative">
          <div className={"invt-add-btn-block"}>
            <Button
              color="primary"
              id="add-Appointment"
              onClick={this.toggleCreateModal}
            >
              <i className={"fa fa-plus"} />
              &nbsp; Create New
            </Button>
            <UncontrolledTooltip target={"add-Appointment"}>
              Create New Appointment
            </UncontrolledTooltip>
            <CrmCircleIcon circleIconPass={"fa fa-cog fa-lg"} />
          </div>
          <CardBody className={"custom-card-body inventory-card"}>
            <Appointments />
          </CardBody>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Calender);
