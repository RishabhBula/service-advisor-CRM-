import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link } from "react-router-dom";
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span>
          <Link to={"/dashboard"}>Admin</Link> &copy; 2019 chapter247.
        </span>
        <span className="ml-auto">
          Powered by <Link to={"/dashboard"}>CRM</Link>
        </span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
