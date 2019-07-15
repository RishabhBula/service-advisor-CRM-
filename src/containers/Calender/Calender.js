import React, { Component } from "react";

import { connect } from "react-redux";
import { Card, CardBody, Button, UncontrolledTooltip } from "reactstrap";

import Appointments from "../../components/Appointments";
import CrmCircleIcon from "../../components/common/CrmCircleIcon";
import AddAppointment from "../../components/Appointments/AddAppointment";
import { logger } from "../../helpers";
import { customerGetRequest, vehicleGetRequest } from "../../actions";

class Calender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null
    };
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
  render() {
    const { modelInfoReducer, getCustomerData, getVehicleData } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { showAddAppointmentModal } = modelDetails;
    logger("Show Add Modal", showAddAppointmentModal);
    const { selectedDate } = this.state;
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
            <Appointments addAppointment={this.toggleAddAppointModal} />
          </CardBody>
        </Card>
        <AddAppointment
          isOpen={showAddAppointmentModal}
          toggleAddAppointModal={this.toggleAddAppointModal}
          getCustomerData={getCustomerData}
          getVehicleData={getVehicleData}
          date={selectedDate}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  getCustomerData: data => {
    dispatch(customerGetRequest(data));
  },
  getVehicleData: data => {
    dispatch(vehicleGetRequest(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Calender);
