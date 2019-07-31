import React from "react";

import CRMModal from "../common/Modal";
import Loader from "../../containers/Loader/Loader";
import moment from "moment";
import { Row, Col, Label } from "reactstrap";

const AppointmentDetails = props => (
  <CRMModal
    isOpen={props.isOpen}
    toggle={props.toggle}
    headerText={"Appointment Details"}
    isAppointment={true}
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
      <div className={"appointment-details"}>
        <Row className={"m-0 pb-2 border-bottom d-flex  align-items-center"}>
          <Col sm={"12"} className={"pb-2 date-block"}>
            <span className={"pr-3"}>
              Date: {moment(props.data.appointmentDate).format("LL")}
            </span>
            <span>
              Time:{" "}
              {`${moment(props.data.startTime).format("hh:mma")} - ${moment(
                props.data.endTime
              ).format("hh:mma")}`}
            </span>
          </Col>
          <Col sm={"12"} className={"pb-2 title"}>
            {props.data.appointmentTitle}
          </Col>
          <Col sm={"2"}>
            <i className={"fa fa-user left-icons"} />
          </Col>
          <Col sm={"10"}>
            <Row>
              <Col sm={"12"} className={"d-flex"}>
                <Label>Customer</Label>
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
              <Col sm={"12"} className={"d-flex"}>
                <Label>Phone</Label>
                <a href={`tel:${props.data.phone}`}>{props.data.phone}</a>
              </Col>
              <Col sm={"12"} className={"d-flex"}>
                <Label>Email: </Label>
                <a
                  href={`mailto:${props.data.email}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {props.data.email}
                </a>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row
          className={"m-0 pb-2 border-bottom pt-2 d-flex  align-items-center"}
        >
          <Col sm={"2"}>
            <i className={"fa fa-truck left-icons"} />
          </Col>
          <Col sm={"10"}>
            <Row>
              <Col sm={"12"} className={"d-flex"}>
                <Label>Vehicle</Label>
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
            </Row>
          </Col>
        </Row>

        <Row className={"m-0"}>
          <Col sm={"2 pt-4"}>
            <i className={"fa fa-cog left-icons"} />
          </Col>
          <Col sm={"10"}>
            <Row>
              <Col sm={"12"} className={"d-flex"}>
                <Label>Order</Label>
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
              <Col sm={"12"} className={"d-flex"}>
                <Label>Techinicians </Label>
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
                          {index !== props.data.techinicians.length - 1
                            ? ", "
                            : null}
                        </React.Fragment>
                      );
                    })
                  : "N/A"}
              </Col>
              <Col sm={"12"} className={"d-flex"}>
                <Label>Note</Label>
                {props.data.note || "N/A"}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )}
  </CRMModal>
);

export default AppointmentDetails;
