import PropTypes from "prop-types";

import React, { Component } from "react";

import { AppNavbarBrand } from '@coreui/react';
// import logo from '../../assets/img/brand/logo.svg';
// import { NavLink } from "react-router-dom";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  
  Nav,
} from "reactstrap";
// import sygnet from '../../assets/img/brand/sygnet.svg'
// import SearchBar from "../../components/common/SearchBar";

import {
  AppHeaderDropdown,
  AppSidebarToggler,
} from "@coreui/react";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <div className="custom-main-logo">
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: "/assets/img/logo-white.svg", width: 40, height: 40, alt: "CRM 360" }}
          minimized={{
            src:
              "/assets/img/logo-white.svg",
            width: 50,
            height: 50,
            alt: "CoreUI Logo"
          }}
        />
        
        <AppSidebarToggler children={<i className="fa fa-bars" />} className="custom-toggle-bar custom-toggle-ba d-md-down-none"  display="lg" />
        {/* <Nav className="d-md-down-none search-input-wrap" navbar>
          <NavItem className="px-3">
            <SearchBar />
          </NavItem>
        </Nav> */}
        </div>
        <Nav className="ml-auto" navbar>
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img
                src={"../../assets/img/avatars/6.jpg"}
                className="img-avatar"
                alt="admin@bootstrapmaster.com"
              />
            </DropdownToggle>
            <DropdownMenu right style={{ right: "auto" }}>             
              {/* <DropdownItem header tag="div" className="text-center">
                <strong>Settings</strong>
              </DropdownItem> */}
              <DropdownItem>
                <i className="fa fa-user" /> Profile
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-wrench" /> Settings
              </DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}>
                <i className="fa fa-lock" /> Logout
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
          {/* <AppAsideToggler className="d-md-down-none">
            <NavItem className="d-md-down-none">
              <NavLink to="#" className="nav-link">
                <i className="icon-bell" />
                <Badge pill color="danger">
                  5
                </Badge>
              </NavLink>
            </NavItem>
          </AppAsideToggler> */}
          <AppHeaderDropdown direction="down" className="header-add-new ">
            <DropdownToggle className="nav-link">
              <span className="fa fa-plus fa-2x pb-2 pt-2" />
            </DropdownToggle>
            <DropdownMenu
              right
              style={{ right: "auto" }}
              className="header-add-new-inner"
            >
              <DropdownItem>
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
        {/* <AppAsideToggler className="d-md-down-none"/> */}

        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
