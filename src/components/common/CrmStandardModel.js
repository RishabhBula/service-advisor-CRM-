import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, FormGroup, Input, Label } from "reactstrap";

export class CrmStandardModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <>        
        <Modal
          isOpen={this.props.openStadardRateModel}
          toggle={this.toggle}
          className={"custom-modal-lg" +this.props.className }
        >
          <ModalHeader toggle={this.toggle}>Create New Rate</ModalHeader>
          <ModalBody>
           <Row className="justify-content-center">
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Year
                  			</Label>
                           <Input
                              type="text"
                              placeholder="20XX"
                              id="year"
                              required
                           />
                           {/* <div className="error-tool-tip">this field is required</div> */}
                        </FormGroup>
                     </Col>
                     <Col md="6">
                        <FormGroup>
                           <Label htmlFor="name" className="customer-modal-text-style">
                              Make
                  			</Label>
                           <Input
                              type="text"
                              placeholder="Honda"
                              id="make"
                              required
                           />
                           
                        </FormGroup>
                     </Col>
                  </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
