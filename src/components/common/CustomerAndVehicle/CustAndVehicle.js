import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { AddCustomer } from "./AddCustomer";
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

  handleModal = () => {
    this.props.toggleModal();
  }
  render() {
    const { displayModal } = this.props;
    const { step } = this.state;
    return (
      <Modal
        isOpen={displayModal}
        toggle={this.handleModal}
        className="customer-modal custom-form-modal custom-modal-lg"
      >
        <ModalHeader toggle={this.props.toggleModal}>
          {step.selected === 1 ? "Create New Customer" : "Second Section"}
        </ModalHeader>
        <ModalBody>
          <AddCustomer />
        </ModalBody>
        <ModalFooter>
         {
          step.selected === 1 ?
          <Button color="primary" onClick={this.addNewCustomer}>
            {"Add Customer"}
          </Button>
          :
           <Button color="primary" onClick={this.addNewCustomer}>
            {"Add Vehicle"}
          </Button>
         }
          <Button color="secondary" onClick={this.handleCustomerModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default CustAndVehicle;
