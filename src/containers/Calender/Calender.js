import React, { Component } from "react";

import { connect } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Button,
  UncontrolledTooltip,
} from "reactstrap";

import Appointments from "../../components/Appointments";
import CrmCircleIcon from "../../components/common/CrmCircleIcon";

class Calender extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <Row>
              <Col sm={"6"} className={"pull-left"}>
                <h4>
                  <i className={"fa fa fa-calendar-alt"} /> Calendar
                </h4>
              </Col>
              <Col sm={"6"} className={"text-right"}>
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
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
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
