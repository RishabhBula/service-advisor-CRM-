import React, { Component } from "react";

import { connect } from "react-redux";
import { Card, CardBody, Button, UncontrolledTooltip } from "reactstrap";

import Appointments from "../../components/Appointments";
import CrmCircleIcon from "../../components/common/CrmCircleIcon";
import AddAppointment from "../../components/Appointments/AddAppointment";
import { logger } from "../../helpers";
import {
  customerGetRequest,
  vehicleGetRequest,
  getOrderListForSelect,
  addAppointmentRequest,
  getAppointments,
  getAppointmentDetails
} from "../../actions";
import Loader from "../Loader/Loader";
import AppointmentDetails from "../../components/Appointments/AppointmentDetails";

class Calender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null,
      editData: {}
    };
  }
  /**
   *
   */
  componentDidMount() {
    this.props.getAppointments({});
  }
  /**
   *
   */
  toggleAddAppointModal = (e, selectedDate) => {
    const { modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { showAddAppointmentModal } = modelDetails;
    this.props.modelOperate({
      showAddAppointmentModal: !showAddAppointmentModal
    });
    if (selectedDate) {
      this.setState({
        selectedDate
      });
    } else {
      this.setState({
        selectedDate: new Date()
      });
    }
  };
  /**
   *
   */
  onEventClick = eventId => {
    this.props.getAppointmentDetails({
      eventId
    });
    this.toggleAppointDetailsModal();
  };
  /**
   *
   */
  toggleAppointDetailsModal = () => {
    const { modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { showAppointmentDetailModal } = modelDetails;
    if (!showAppointmentDetailModal) {
      this.setState({
        editData: {}
      });
    }
    this.props.modelOperate({
      showAppointmentDetailModal: !showAppointmentDetailModal
    });
  };
  /**
   *
   */
  toggleEditAppointModal = editData => {
    this.toggleAddAppointModal();
    this.setState({
      editData
    });
  };
  /**
   *
   */
  render() {
    const {
      modelInfoReducer,
      getCustomerData,
      getVehicleData,
      getOrders,
      addAppointment,
      appointmentReducer,
      appointmentDetailsReducer
    } = this.props;
    const { isLoading, data } = appointmentReducer;
    const { modelDetails } = modelInfoReducer;
    const {
      showAddAppointmentModal,
      showAppointmentDetailModal
    } = modelDetails;
    logger("Show Add Modal", showAddAppointmentModal);
    const { selectedDate, editData } = this.state;
    return (
      <div className="animated fadeIn">
        <Card className="white-card position-relative">
          <div className={"invt-add-btn-block"}>
            <Button
              color="primary"
              id="add-Appointment"
              onClick={this.toggleAddAppointModal}
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
            {isLoading ? (
              <Loader />
            ) : (
              <Appointments
                addAppointment={this.toggleAddAppointModal}
                data={data}
                onEventClick={this.onEventClick}
              />
            )}
          </CardBody>
        </Card>
        <AddAppointment
          isOpen={showAddAppointmentModal}
          toggleAddAppointModal={this.toggleAddAppointModal}
          getCustomerData={getCustomerData}
          getVehicleData={getVehicleData}
          date={selectedDate}
          getOrders={getOrders}
          addAppointment={addAppointment}
          editData={editData}
        />
        <AppointmentDetails
          isOpen={showAppointmentDetailModal}
          toggle={this.toggleAppointDetailsModal}
          isLoading={appointmentDetailsReducer.isLoading}
          data={appointmentDetailsReducer.data}
          toggleEditAppointModal={this.toggleEditAppointModal}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  appointmentReducer: state.appointmentReducer,
  appointmentDetailsReducer: state.appointmentDetailsReducer
});

const mapDispatchToProps = dispatch => ({
  getAppointments: data => dispatch(getAppointments(data)),
  getAppointmentDetails: data => dispatch(getAppointmentDetails(data)),
  getCustomerData: data => dispatch(customerGetRequest(data)),
  getVehicleData: data => dispatch(vehicleGetRequest(data)),
  getOrders: data => dispatch(getOrderListForSelect(data)),
  addAppointment: data => dispatch(addAppointmentRequest(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Calender);
