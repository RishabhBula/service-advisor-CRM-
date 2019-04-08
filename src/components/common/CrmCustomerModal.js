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
import Select from "react-select";
import { CrmFleetModal } from "../common/CrmFleetModal";

export class CrmCustomerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      large: false,
      switchValue: true,
      selectedOption: null,
      expandForm: false,
      fleetModalOpen: false
    };
  }
  handleClick = e => {
    this.setState({
      switchValue: !this.state.switchValue
    });
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };
  handleExpandForm = () => {
    this.setState({
      expandForm: !this.state.expandForm
    });
  };
  render() {
    const { customerModalOpen, handleCustomerModal } = this.props;
    const {
      switchValue,
      selectedOption,
      expandForm,
      fleetModalOpen
    } = this.state;
    console.log(switchValue);
    return (
      <>
        <Modal
          isOpen={customerModalOpen}
          toggle={handleCustomerModal}
          className="customer-modal"
        >
          <ModalHeader toggle={handleCustomerModal}>Create New Customer</ModalHeader>
          <ModalBody>
            <div className="">
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      First Name
                    </Label>
                    <Input type="text" placeholder="John" id="name" required />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Last Name
                    </Label>
                    <Input type="text" placeholder="Doe" id="name" required />
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
                      required
                    />
                  </FormGroup>
                </Col>
                <div>
                  {!expandForm ? (
                    <span
                      onClick={this.handleExpandForm}
                      className="customer-anchor-text customer-click-btn"
                    >
                      {" "}
                      Show More{" "}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </Row>
            </div>
            {expandForm ? (
              <>
                <div className="">
                  <Row className="justify-content-center">
                    <Col md="12">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Company
                        </Label>
                        <Input
                          type="text"
                          placeholder="Company"
                          id="name"
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
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Referral Source
                        </Label>
                        <Select
                          value={selectedOption}
                          onChange={this.handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div className="">
                  <Row className="justify-content-center">
                    <Col md="12">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Fleet
                        </Label>
                        <Select
                          value={selectedOption}
                          onChange={this.handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div className="">
                  <Row className="justify-content-center">
                    <Col md="12">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Address 1
                        </Label>
                        <Input
                          type="text"
                          placeholder="Address"
                          id="name"
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
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Address 2
                        </Label>
                        <Input
                          type="text"
                          placeholder="Address"
                          id="name"
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
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          City
                        </Label>
                        <Input
                          type="text"
                          id="name"
                          placeholder="New York"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          State
                        </Label>
                        <Input
                          type="text"
                          id="name"
                          placeholder="NY"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label
                          htmlFor="name"
                          className="customer-modal-text-style"
                        >
                          Zip Code
                        </Label>
                        <Input
                          type="text"
                          id="name"
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
                    {expandForm ? (
                      <span
                        onClick={this.handleExpandForm}
                        className="customer-anchor-text customer-click-btn"
                      >
                        {" "}
                        Show Less{" "}
                      </span>
                    ) : (
                      ""
                    )}
                  </Row>
                </div>
              </>
            ) : (
              ""
            )}
            {fleetModalOpen ? <CrmFleetModal /> : ""}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleCustomerModal}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={handleCustomerModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
