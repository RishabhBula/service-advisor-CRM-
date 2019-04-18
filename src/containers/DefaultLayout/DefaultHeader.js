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
import SearchBar from "../../components/common/SearchBar";
import { AppNavbarBrand } from "@coreui/react";

import { AppHeaderDropdown, AppSidebarToggler } from "@coreui/react";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  toggleCustAndVehicle = () => {
    this.props.toggleCustAndVehicle();
  };
  render() {
    const { permissions } = this.props;
    // eslint-disable-next-line
    return (
      <React.Fragment>
        <div className="custom-main-logo">
          <AppSidebarToggler className="d-lg-none" display="md" mobile />
          <AppNavbarBrand
            full={{
              src: this.props.shopLogo || "/assets/img/logo-white.svg",
              width: 40,
              height: 40,
              alt: "Service Adviser"
            }}
            minimized={{
              src: this.props.shopLogo || "/assets/img/logo-white.svg",
              width: 50,
              height: 50,
              alt: "Service Adviser"
            }}
          />

          <AppSidebarToggler
            children={<i className="fa fa-bars" />}
            className="custom-toggle-bar custom-toggle-ba d-md-down-none"
            display="lg"
          />
          <Nav className="d-md-down-none search-input-wrap" navbar>
            <NavItem className="px-3">
              <SearchBar />
            </NavItem>
          </Nav>
          <Nav className="d-md-down-none" navbar>
            {permissions.isAllowedDashboard ? (
              <NavItem className="px-3">
                <NavLink to="/dashboard" className="nav-link">
                  Dashboard
                </NavLink>
              </NavItem>
            ) : null}
            {permissions.isAllowedCalendar ? (
              <NavItem className="px-3">
                <NavLink to="/calender" className="nav-link">
                  Calender
                </NavLink>
              </NavItem>
            ) : null}
            {permissions.isAllowedCompanySettings ? (
              <NavItem className="px-3">
                <NavLink to="/settings/users" className="nav-link">
                  Staff
                </NavLink>
              </NavItem>
            ) : null}

            <NavItem className="px-3">
              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>
            </NavItem>
            <NavItem className="px-3">
              <NavLink
                to="#"
                className="nav-link"
                onClick={e => this.props.onLogout(e)}
              >
                Logout
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
                <DropdownItem>
                  <span className="header-add-icon">
                    <i className="far fa-file-alt" />
                    <i className="fal fa-file-invoice" />
                  </span>
                  <span>Quote</span>
                </DropdownItem>
                <DropdownItem>
                  <span className="header-add-icon">
                    <i className="fa fa-tasks" />
                  </span>
                  <span>Appointment</span>
                </DropdownItem>
                <DropdownItem>
                  <span className="header-add-icon">
                    <i className="fas fa-sitemap" />
                  </span>
                  <span>Inventory</span>
                </DropdownItem>
                <DropdownItem>
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
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
