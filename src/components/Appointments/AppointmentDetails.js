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
          {props.data.customerId ? (
            <a
              href="/"
              onClick={e => {
                e.preventDefault();
                props.onCustomerClick(props.data.customerId._id);
              }}
            >{`${props.data.customerId.firstName} ${
              props.data.customerId.lastName
            }`}</a>
          ) : (
            "N/A"
          )}
        </Col>
        <Col sm={"6"}>
          Order:{" "}
          {props.data.orderId ? (
            <a
              href="/"
              onClick={e => {
                e.preventDefault();
                props.orderClick(props.data.orderId._id);
              }}
            >{`${props.data.orderId.orderName}`}</a>
          ) : (
            "N/A"
          )}
        </Col>
        <Col sm={"6"}>
          Vehicle:{" "}
          {props.data.vehicleId ? (
            <a
              href="/"
              onClick={e => {
                e.preventDefault();
                props.onVehicleClick(props.data.vehicleId._id);
              }}
            >{`${props.data.vehicleId.make}`}</a>
          ) : (
            "N/A"
          )}
        </Col>
        <Col sm={"6"}>
          Phone: <a href={`tel:${props.data.phone}`}>{props.data.phone}</a>
        </Col>
        <Col sm={"6"}>
          Email:{" "}
          <a
            href={`mailto:${props.data.email}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {props.data.email}
          </a>
        </Col>
        <Col sm={"6"}>
          Techinicians:{" "}
          {props.data.techinicians && props.data.techinicians.length
            ? props.data.techinicians.map((tech, index) => {
                return (
                  <React.Fragment key={index}>
                    <a
                      href={`/`}
                      onClick={e => {
                        e.preventDefault();
                        // window.open(`${AppRoutes.STAFF_MEMBERS}`)
                      }}
                    >{`${tech.firstName} ${tech.lastName}`}</a>
                    {index !== props.data.techinicians.length - 1 ? ", " : null}
                  </React.Fragment>
                );
              })
            : "N/A"}
        </Col>
      </Row>
    )}
  </CRMModal>
);

export default AppointmentDetails;
