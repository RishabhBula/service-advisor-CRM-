import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, FormGroup, Input, Label } from "reactstrap";

export class CrmStandardModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openStadardRateModel: false,
      name: "",
      hourRate: "",
      isSubmitted: false
    };
  }

  toggle = () => {
    this.props.stdModelFun();
    // this.setState({
    //   openStadardRateModel: !this.state.openStadardRateModel
    // });
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    if (
      (name === 'hourRate') &&
      (isNaN(value))
    ) {
      return;
    }
    else {
      this.setState({
        [name]: value,
      });
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      isSubmitted: true
    })
    const data = {
      name: this.state.name,
      hourRate: this.state.hourRate
    }
    this.props.handleRateAdd(data)
  }
  render() {
    const { name, hourRate, isSubmitted } = this.state
    const { openStadardRateModel, errors } = this.props
    return (
      <>
        <Modal
          isOpen={openStadardRateModel}
          toggle={this.toggle}
          className={"custom-modal-lg" + this.props.className}
        >
          <ModalHeader toggle={this.toggle}>Create New Rate</ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Name
                  </Label>
                  <Input
                    type="text"
                    placeholder="rate name"
                    name="name"
                    value={name}
                    onChange={this.handleChange}
                    id="name"
                    required
                  />
                  {
                    errors && !name && errors.name ?
                      <div className="error-tool-tip">Name is required</div> :
                      null
                  }
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Hour Rate
                  </Label>
                  <Input
                    type="text"
                    name="hourRate"
                    value={hourRate}
                    placeholder="20"
                    onChange={this.handleChange}
                    id="make"
                    maxLength='3'
                    required
                  />
                  {
                    errors && !hourRate && errors.hourRate ?
                      <div className="error-tool-tip">Hour rate is required</div> :
                      null
                  }
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
              Add Rate
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
