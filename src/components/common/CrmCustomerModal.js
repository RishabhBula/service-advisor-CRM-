import React, { Component } from "react";
import Validator from "js-object-validation";
import  MaskedInput from "react-maskedinput";
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
import Select from "react-select";
import { AppSwitch } from "@coreui/react";
import { CrmFleetModal } from "../common/CrmFleetModal";
import { CrmSelect } from "../common/CrmSelect";

import {
  CustomerDefaultPermissions,
  CustomerPermissionsText
} from "../../config/Constants";
import {
  AppConfig
} from "../../config/AppConfig";
import { CreateCustomerValidations, CreateCustomerValidMessaages } from "../../validations";

export class CrmCustomerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: true,
      selectedOption: null,
      expandForm: false,
      fleetModalOpen: false,
      customerDefaultPermissions: CustomerDefaultPermissions,
      firstName: "",
      lastName: "",
      email: "",
      phone: {},
      type: "admin",
      errors: {},
      phoneLength: AppConfig.phoneLength,
      percentageDiscount: 0,
      defaultOptions: [
        { custom: true },
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "", label: "Add New" }
      ]
    };
  }
  handleClick (singleState, e) {
    const { customerDefaultPermissions } = this.state;
    customerDefaultPermissions[singleState].status = e.target.checked;
    this.setState({
     ...customerDefaultPermissions
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

  handleInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  }

  addNewUser = () => {
    this.props.addCustomer();
  }

  addNewSection = () => {
    alert("testing");
  }
  
  render() {
    const { customerModalOpen, handleCustomerModal } = this.props;
    const {
      switchValue,
      selectedOption,
      expandForm,
      fleetModalOpen,
      customerDefaultPermissions,
      defaultOptions
    } = this.state;  

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
                {
                CustomerPermissionsText.map((permission, index) => {
                  let discountShow = false;
                  let labourRate = false;
                  let pricingMatrix = false;
                  if(permission.key === "shouldReceiveDiscount" && customerDefaultPermissions[
                          permission.key
                        ].status)
                  {
                    discountShow = true;
                  }

                  if(permission.key === "shouldLaborRateOverride" && customerDefaultPermissions[
                          permission.key
                        ].status)
                  {
                    labourRate = true;
                  }

                   if (
                     permission.key ===
                       "shouldPricingMatrixOverride" &&
                     customerDefaultPermissions[
                       permission.key
                     ].status
                   ) {
                     pricingMatrix = true;
                   }
                    return (
                      <Row
                        className="justify-content-center pb-2"
                        key={index}
                      >
                        <Col md="2">
                          <AppSwitch
                            className={"mx-1"}
                            checked={
                              customerDefaultPermissions[
                                permission.key
                              ].status
                            }
                            onClick={this.handleClick.bind(
                              this,
                              permission.key
                            )}
                            variant={"3d"}
                            color={"primary"}
                            size={"sm"}
                          />
                        </Col>
                        <Col md="10">
                          <p className="customer-modal-text-style">
                            {permission.text}
                          </p>
                        </Col>
                        {discountShow ? (
                          <Col md="12">
                            <Label
                              htmlFor="name"
                              className="customer-modal-text-style"
                            >
                              Percent Discount
                            </Label>
                            <FormGroup>
                              <MaskedInput
                                mask="11 \%"
                                name="percentageDiscount"
                                size="20"
                                onChange={
                                  this.handleInputChange
                                }
                              />
                            </FormGroup>
                          </Col>
                        ) : null}

                        {labourRate ? (
                          <Col md="12">
                            <CrmSelect
                              defaultOptions={
                                defaultOptions
                              }
                              onClickAddNew={
                                this.addNewSection
                              }
                            />
                          </Col>
                        ) : null}
                        {/* */}
                        {pricingMatrix ? (
                          <Col md="12">
                            <Input
                              type="select"
                              className=""
                             
                            >
                              <option value="5ca3473d70537232f13ff1f9">
                                Admin
                              </option>
                              <option value="5ca3473d70537232f13ff1fa">
                                Technician
                              </option>
                            </Input>
                            <Select
                              defaultOptions={
                                defaultOptions
                              }
                            />
                          </Col>
                        ) : null}
                      </Row>
                    );
                  })
                }
                </div>
              </>
            ) : (
              ""
            )}
            {fleetModalOpen ? <CrmFleetModal /> : ""}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addNewUser}> 
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
