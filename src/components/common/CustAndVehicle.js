import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
class CustAndVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: {
        selected: 1,
        stepList: [
          {
            text: "Create New Customer"
          },
          {
            text: "Create New Vehicle"
          }
        ]
      }
    };
  }

  render() {
    const { displayModal } = this.props;
    return (
      <Modal
        isOpen={displayModal}
        toggle={this.handleCustomerModal}
        className="customer-modal custom-form-modal custom-modal-lg"
      >
        <ModalHeader toggle={this.props.toggleModal}>
          {"Create New Customer"}
        </ModalHeader>
        <ModalBody />
      </Modal>
    );
  }
}

export default CustAndVehicle;
