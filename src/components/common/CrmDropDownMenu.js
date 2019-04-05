import React, { Component } from "react";
import Avatar from "react-avatar";
import {
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
} from "reactstrap";
import CrmCircleIcon from "../../components/common/CrmCircleIcon";

class CrmDropDownMenu extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  performAction(keyData) {
    this.props.returnCrmDropAction(keyData);
  }

  optionsArray() {
    const { options } = this.props;
    return options.map((item, index) => {
      return (
        <DropdownItem onClick={() => this.performAction(item)} key={index}>
          {item.value}
        </DropdownItem>
      );
    });
  }

  render() {
    const {
      imageDisplay,
      imagePass,
      iconPass,
      classNamePass,
      cssPass,
    } = this.props;
    console.log(imagePass);

    return (
      <div className={classNamePass}>
        <Dropdown
          direction="down"
          isOpen={this.state.dropdownOpen}
          toggle={this.toggle}
        >
          <DropdownToggle nav>
            {imageDisplay ? (
              <Avatar
                className="ml-1"
                src={imagePass.image}
                size={imagePass.size}
                round={true}
              />
            ) : (
              <CrmCircleIcon circleIconPass={iconPass} cssPass={cssPass} />
            )}
          </DropdownToggle>
          <DropdownMenu right>
            {this.optionsArray()}
            {/* <DropdownItem>
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
            </DropdownItem> */}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default CrmDropDownMenu;
