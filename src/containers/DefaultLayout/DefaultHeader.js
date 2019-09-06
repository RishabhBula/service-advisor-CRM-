import PropTypes from "prop-types";
import React, { Component } from "react";

// import logo from '../../assets/img/brand/logo.svg';
import { NavLink } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem
} from "reactstrap";
import { AppRoutes } from "../../config/AppRoutes";
// import SearchBar from "../../components/common/SearchBar";
import { CrmFleetModal } from "../../components/common/CrmFleetModal";
import { AppHeaderDropdown, AppSidebarToggler } from "@coreui/react";
import { logger } from "../../helpers";
import AddAppointment from "../../components/Appointments/AddAppointment";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreate: false,
      selectedDate: new Date()
    };
  }
  toggleCustAndVehicle = () => {
    this.props.toggleCustAndVehicle();
  };
  handleNewOrder = () => {
    this.props.addOrderRequest();
  };
  handleInventrySection = () => {
    this.props.redirectTo(AppRoutes.INVENTORY_STATATICS.url);
  };
  toggleCreateModal = e => {
    e.preventDefault();
    this.setState({
      openCreate: !this.state.openCreate
    });
  };
  handleAddFleet = data => {
    try {
      this.props.addFleet(data);
      this.setState({
        openCreate: !this.state.openCreate
      });
    } catch (error) {
      logger(error);
    }
  };
  onTypeHeadStdFun = data => {
    this.props.getStdList(data);
  };
  setDefaultRate = value => {
    this.props.setLabourRateDefault(value);
  };
  toggleAddAppointModal = () => {
    const { modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { showAddAppointmentModalHeader } = modelDetails;
    this.props.modelOperate({
      showAddAppointmentModalHeader: !showAddAppointmentModalHeader
    });
    this.setState({
      editData: {},
      selectedDate: new Date()
    });
  };
  render() {
    const {
      permissions,
      rateStandardListReducer,
      profileInfoReducer,
      showAddAppointmentModalHeader,
      matrixListReducer,
      getCustomerData,
      getVehicleData,
      getOrders,
      addAppointment,
      getUserData,
      getMatrix
    } = this.props;
    const { openCreate, selectedDate } = this.state;
    // eslint-disable-next-line
    return (
      <React.Fragment>
        <div className="custom-main-logo">
          <AppSidebarToggler className="d-lg-none" display="md" mobile />

          {/* <AppSidebarToggler
            children={<i className="fa fa-bars" />}
            className="custom-toggle-bar custom-toggle-ba d-md-down-none"
            display="lg"
          /> */}
          {/* <Nav className="d-md-down-none search-input-wrap" navbar>
            <NavItem className="px-3">
              <SearchBar />
            </NavItem>
          </Nav> */}
          <Nav className="d-md-down-none" navbar>
            {/* {permissions.isAllowedDashboard ? (
              <NavItem className="px-3">
                <NavLink to="/dashboard" className="nav-link">
                  Dashboard
                </NavLink>
              </NavItem>
            ) : null} */}
            {permissions.isAllowedCalendar ? (
              <NavItem className="px-3">
                <NavLink to="/calender" className="nav-link">
                  <i className={"icons icon-calendar"} /> Appointments
                </NavLink>
              </NavItem>
            ) : null}
            {permissions.isAllowedCompanySettings ? (
              <NavItem className="px-3">
                <NavLink to="/settings/staff-members" className="nav-link">
                  <i className={"icons icon-people"} /> Technician
                </NavLink>
              </NavItem>
            ) : null}

            <NavItem className="px-3">
              <NavLink to="/profile" className="nav-link">
                <i className={"icons icon-user"} /> Profile
              </NavLink>
            </NavItem>
            <NavItem className="px-3">
              <NavLink
                to="#"
                className="nav-link"
                onClick={e => this.props.onLogout(e)}
              >
                <i className={"icons icon-logout"} /> Logout
              </NavLink>
            </NavItem>
          </Nav>
          <Nav navbar>
            <AppHeaderDropdown direction="down" className="header-add-new ">
              <DropdownToggle className="nav-link">
                <span className="fa fa-plus fa-2x pb-2 pt-2" />
              </DropdownToggle>
              <DropdownMenu
                right
                style={{ right: "auto" }}
                className="header-add-new-inner"
              >
                <DropdownItem onClick={this.toggleCustAndVehicle}>
                  <span className="header-add-icon">
                    <i className="fa fa-bell-o" />
                  </span>
                  <span className="header-add-text">Customer & Vehicle</span>
                </DropdownItem>
                <DropdownItem onClick={this.handleNewOrder}>
                  <span className="header-add-icon">
                    <i className="far fa-file-alt" />
                    <i className="fal fa-file-invoice" />
                  </span>
                  <span>Quote</span>
                </DropdownItem>
                <DropdownItem onClick={this.toggleAddAppointModal}>
                  <span className="header-add-icon">
                    <i className="fa fa-tasks" />
                  </span>
                  <span>Appointment</span>
                </DropdownItem>
                <DropdownItem onClick={this.handleInventrySection}>
                  <span className="header-add-icon">
                    <i className="fas fa-sitemap" />
                  </span>
                  <span>Inventory</span>
                </DropdownItem>
                <DropdownItem onClick={this.toggleCreateModal}>
                  <span className="header-add-icon">
                    <i className="fa fa-automobile" />
                  </span>
                  <span>Fleet</span>
                </DropdownItem>
                <DropdownItem>
                  <span className="header-add-icon">
                    <i className="fa fa-envelope-o" />
                  </span>
                  <span>Message</span>
                </DropdownItem>
              </DropdownMenu>
            </AppHeaderDropdown>
          </Nav>
        </div>
        <CrmFleetModal
          fleetModalOpen={openCreate}
          handleFleetModal={this.toggleCreateModal}
          handleAddFleet={this.handleAddFleet}
          onTypeHeadStdFun={this.onTypeHeadStdFun}
          setDefaultRate={this.setDefaultRate}
          addFleet={this.handleAddFleet}
          rateStandardListData={rateStandardListReducer}
          profileInfoReducer={profileInfoReducer.profileInfo}
          matrixListReducerData={matrixListReducer}
          getPriceMatrix={getMatrix}
        />
        <AddAppointment
          isOpen={showAddAppointmentModalHeader}
          toggleAddAppointModal={this.toggleAddAppointModal}
          getCustomerData={getCustomerData}
          getVehicleData={getVehicleData}
          date={selectedDate}
          getOrders={getOrders}
          addAppointment={addAppointment}
          getUserData={getUserData}
        />
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
