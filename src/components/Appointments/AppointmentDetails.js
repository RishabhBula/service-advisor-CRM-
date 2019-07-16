import React from "react";

import CRMModal from "../common/Modal";
import Loader from "../../containers/Loader/Loader";
import moment from "moment";
import { Row, Col } from "reactstrap";
const AppointmentDetails = props => (
  <CRMModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    headerText={"Appointment Details"}
    footerButtons={[
      {
        text: "Edit",
        color: "primary",
        onClick: e => {
          props.toggle(e);
          props.toggleEditAppointModal(props.data);
        }
      },
      {
        text: "Close",
        onClick: props.toggle
      }
    ]}
  >
    {props.isLoading ? (
      <Loader />
    ) : (
      <Row>
        <Col sm={"6"}>
          Date: {moment(props.data.appointmentDate).format("LL")}
          Time:{" "}
          {`${moment(props.data.startTime).format("hh:mma")} - ${moment(
            props.data.endTime
          ).format("hh:mma")}`}
        </Col>
        <Col sm={"6"}>Note: {props.data.note || "N/A"}</Col>
        <Col sm={"6"}>
          Customer:{" "}
          {props.data.customerId
            ? `${props.data.customerId.firstName} ${
                props.data.customerId.lastName
              }`
            : "N/A"}
        </Col>
        <Col sm={"6"}>
          Order:{" "}
          {props.data.orderId ? `${props.data.orderId.orderName}` : "N/A"}
        </Col>
        <Col sm={"6"}>Phone: {props.data.phone}</Col>
        <Col sm={"6"}>Email: {props.data.email}</Col>
      </Row>
    )}
  </CRMModal>
);

export default AppointmentDetails;
