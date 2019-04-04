import React, { Component } from 'react';
import {  NavLink } from 'react-router-dom';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem
} from "reactstrap";
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';

import logo from '../../assets/img/brand/logo.svg'
// import sygnet from '../../assets/img/brand/sygnet.svg'
import SearchBar from "../../components/common/SearchBar";
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
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: "CRM 360" }}
          minimized={{
            src:
              "https://lh3.googleusercontent.com/-mOdZ60CO41M/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rcXgxErxs0owKD3P6zcxZyijqp5pw/s32-c-mo/photo.jpg",
            width: 30,
            height: 30,
            alt: "CoreUI Logo"
          }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="d-md-down-none search-input-wrap" navbar>
          <NavItem className="px-3">
            <SearchBar />
          </NavItem>
        </Nav>
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
              <DropdownItem header tag="div" className="text-center">
                <strong>Account</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-bell-o" /> Updates
                <Badge color="info">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-envelope-o" /> Messages
                <Badge color="success">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-tasks" /> Tasks
                <Badge color="danger">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-comments" /> Comments
                <Badge color="warning">42</Badge>
              </DropdownItem>
              <DropdownItem header tag="div" className="text-center">
                <strong>Settings</strong>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-user" /> Profile
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-wrench" /> Settings
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-usd" /> Payments
                <Badge color="secondary">42</Badge>
              </DropdownItem>
              <DropdownItem>
                <i className="fa fa-file" /> Projects
                <Badge color="primary">42</Badge>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <i className="fa fa-shield" /> Lock Account
              </DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}>
                <i className="fa fa-lock" /> Logout
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
          <AppAsideToggler className="d-md-down-none">
            <NavItem className="d-md-down-none">
              <NavLink to="#" className="nav-link">
                <i className="icon-bell" />
                <Badge pill color="danger">
                  5
                </Badge>
              </NavLink>
            </NavItem>
          </AppAsideToggler>
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
