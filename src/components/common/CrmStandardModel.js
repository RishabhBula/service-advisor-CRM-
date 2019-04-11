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
                           <div className="error-tool-tip">this field is required</div>
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

export class BigModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      large: false
    };
  }

  toggleLarge = () => {
    this.setState({
      large: !this.state.large
    });
  };

  render() {
    return (
      <>
        <Button onClick={this.toggleLarge} className="mr-1">
          Launch large modal
        </Button>
        <Modal
          isOpen={this.state.large}
          toggle={this.toggleLarge}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader toggle={this.toggleLarge}>Modal title</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleLarge}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleLarge}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export class SmallModels extends Component {
  handleToggleSmall = () => {
    this.props.handleSmallModel();
  };

  handleSubmit = () => {
    alert("do something ");
  };
  render() {
    const { smallModelDisplay } = this.props;

    return (
      <>
        <Modal
          isOpen={smallModelDisplay}
          toggle={this.handleToggleSmall}
          className={"modal-sm " + this.props.className}
        >
          {/* <ModalHeader toggle={this.toggleSmall}>Modal title</ModalHeader> */}
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={this.handleToggleSmall}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
