import React, { Component } from "react";
import {
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Badge,
  Dropdown
} from "reactstrap";

class CrmCircleIcon
 extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      const { circleIconPass, cssPass } = this.props;      
      
    return (
      <span style={cssPass ? cssPass: null} className="circle-icon-option">
        <i class={circleIconPass} />
      </span>
    );
  }
}

export default CrmCircleIcon;
