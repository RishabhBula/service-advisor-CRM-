import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import {
  AppConfig
} from "../../config/AppConfig";

export class CrmFleetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: true,
      companyName: "",
      phoneDetail: {},
      email: "",
      notes: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      permission: "",
      errors: {},
      phoneLength: AppConfig.phoneLength
    };
  }
  handleClick = e => {
    this.setState({
      switchValue: !this.state.switchValue
    });
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    if (
      (name === 'phoneDetail' ||
        name === 'zipCode') &&
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
  render() {
    const { fleetModalOpen,
      handleFleetModal,
      modalClassName } = this.props;
    const { switchValue,
      companyName,
      phoneDetail,
      email,
      notes,
      address1,
      address2,
      city,
      state,
      zipCode } = this.state;
    return (
      <>
        <Modal
          isOpen={fleetModalOpen}
          toggle={handleFleetModal}
          className={
            !modalClassName ? "customer-modal" : modalClassName
          }
        >
          <ModalHeader toggle={handleFleetModal}>Create New Fleet</ModalHeader>
          <ModalBody>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Company name (*)
                    </Label>
                    <Input
                      type="text"
                      name="companyName"
                      onChange={this.handleChange}
                      placeholder="John"
                      value={companyName}
                      id="name" required />
                  </FormGroup>
                </Col>
              </Row>
            </div>

            <div className="">
              <Row className="justify-content-center">
                <Col md="3">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Phone
                    </Label>
                    <Input type="select" id="name" required>
                      <option value=" ">Mobile</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="9">
                  <FormGroup>
                    <Label />
                    <Input
                      type="text"
                      placeholder="(555) 055-0555"
                      id="name"
                      onChange={this.handleChange}
                      name="phoneDetail"
                      value={phoneDetail}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div>
                <span className="customer-add-phone">
                  Add another phone number
                </span>
              </div>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Email (Optional)
                    </Label>
                    <Input
                      type="text"
                      className="customer-modal-text-style"
                      placeholder="john.doe@example.com"
                      id="name"
                      value={email}
                      onChange={this.handleChange}
                      name="email"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Notes
                    </Label>
                    <Input
                      type="textarea"
                      placeholder="Enter a note..."
                      id="name"
                      value={notes}
                      onChange={this.handleChange}
                      name="notes"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Address 1
                    </Label>
                    <Input
                      type="text"
                      placeholder="Address"
                      id="name"
                      value={address1}
                      onChange={this.handleChange}
                      name="address1"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Address 2
                    </Label>
                    <Input
                      type="text"
                      placeholder="Address"
                      id="name"
                      value={address2}
                      onChange={this.handleChange}
                      name="address2"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      City
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="city"
                      value={city}
                      onChange={this.handleChange}
                      placeholder="New York"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="2">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      State
                    </Label>
                    <Input
                      type="text"
                      name="state"
                      value={state}
                      onChange={this.handleChange}
                      id="name"
                      placeholder="NY" required />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label htmlFor="name" name="zip" className="customer-modal-text-style">
                      Zip Code
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="zipCode"
                      value={zipCode}
                      onChange={this.handleChange}
                      placeholder="Zip Code"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="">
              <Row className="justify-content-center pb-2">
                <Col md="2">
                  <AppSwitch
                    className={"mx-1"}
                    value={switchValue}
                    onClick={this.handleClick}
                    variant={"3d"}
                    color={"primary"}
                    checked
                    size={""}
                  />
                </Col>
                <Col md="10">
                  <p className="customer-modal-text-style">
                    Is this customer tax exempt?
                  </p>
                </Col>
              </Row>
              <Row className="justify-content-center pb-2">
                <Col md="2">
                  <AppSwitch
                    className={"mx-1"}
                    value={switchValue}
                    onClick={this.handleClick}
                    variant={"3d"}
                    color={"primary"}
                    checked
                    size={""}
                  />
                </Col>
                <Col md="10">
                  <p className="customer-modal-text-style">
                    Does this customer receive a discount?
                  </p>
                </Col>
              </Row>
              <Row className="justify-content-center pb-2">
                <Col md="2">
                  <AppSwitch
                    className={"mx-1"}
                    value={switchValue}
                    onClick={this.handleClick}
                    variant={"3d"}
                    color={"primary"}
                    checked
                    size={""}
                  />
                </Col>
                <Col md="10">
                  <p className="customer-modal-text-style">
                    Does this customer have a labor rate override?
                  </p>
                </Col>
              </Row>
              <Row className="justify-content-center pb-2">
                <Col md="2">
                  <AppSwitch
                    className={"mx-1"}
                    value={switchValue}
                    onClick={this.handleClick}
                    variant={"3d"}
                    color={"primary"}
                    checked
                    size={""}
                  />
                </Col>
                <Col md="10">
                  <p className="customer-modal-text-style">
                    Does this customer have a pricing matrix override?
                  </p>
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleFleetModal}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={handleFleetModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
