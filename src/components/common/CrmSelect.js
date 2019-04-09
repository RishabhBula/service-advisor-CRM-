import React, { Component } from "react";
import Validator from "js-object-validation";
import Select, { components } from "react-select";

class CustomOption extends Component {
  
  clickedOpen = () => {
      console.log(this.props);
    if (this.props.innerProps.onClickAddNew) {
      this.props.innerProps.onClickAddNew();
    } 
      
  }

  render() {
    const { data, innerRef, innerProps } = this.props;
    
    return data.custom ? (
      <div
        className="cursor_pointer common-drop-down "
        ref={innerRef}
        {...innerProps}
        onClick={this.clickedOpen}
      >
        <span className="ml-3">Add New Customer</span>
      </div>
    ) : (
      <components.Option {...this.props} className="abc"/>
    );
  }
}

export class CrmSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  clickedOpen = () => {
    if (this.props.onClickAddNew) 
    this.props.onClickAddNew();
  }

  render() {
    const { defaultOptions } = this.props;   

    return (
      <>
        <Select
          components={{
            Option: CustomOption
          }}
          options={defaultOptions}
          onClickAddNew={this.clickedOpen}
        />
      </>
    );
  }
}


export default CrmSelect;