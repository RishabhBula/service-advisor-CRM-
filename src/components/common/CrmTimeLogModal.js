import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Col, FormGroup, Input, Label, InputGroup } from "reactstrap";

export class CrmTimeLogModel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Modal
          isOpen={openTimeLogModal}
          toggle={handleTimeLogModal}
          className='customer-modal custom-form-modal '
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggle}>Add New Time Log</ModalHeader>
          <ModalBody>
            Time Logs Modal Works
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
              Add Time Log
            </Button>{" "}
            <Button color="secondary" onClick={handleTimeLogModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
