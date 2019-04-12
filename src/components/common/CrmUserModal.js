import React, { Component } from "react";
import * as classnames from "classnames";
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
  Input,
  Form,
  FormFeedback
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import { logger } from "../../helpers/Logger";
import Validator from "js-object-validation";
import {
  CreateUserValidations,
  CreateUserValidationsMessaages
} from "../../validations";
import {
  AdminDefaultPermissions,
  TechincianDefaultPermissions,
  UserPermissions,
  RoleOptions
} from "../../config/Constants";
import CurrencyInput from "react-currency-input";

export class CrmUserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roleType: "5ca3473d70537232f13ff1f9",
      rate: "",
      permissions: AdminDefaultPermissions,
      errors: {},
      isEditMode: false
    };
  }
  componentDidUpdate({ userModalOpen, userData }) {
    if (this.props.userModalOpen !== userModalOpen) {
      this.setState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roleType: "5ca3473d70537232f13ff1f9",
        rate: "",
        permissions: AdminDefaultPermissions,
        errors: {}
      });
    }
    if (
      this.props.userData &&
      this.props.userData._id &&
      userData._id !== this.props.userData._id
    ) {
      const {
        firstName,
        lastName,
        email,
        phone,
        roleType,
        rate,
        permissions
      } = this.props.userData;
      this.setState({
        isEditMode: true,
        firstName,
        lastName,
        email,
        phone: phone || "",
        roleType: roleType._id,
        rate: rate || "",
        permissions
      });
    }
  }
  handleClick = e => {
    this.setState({
      permissions: {
        ...this.state.permissions,
        [e.target.name]: e.target.checked
      }
    });
  };
  handleInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
    if (name === "roleType") {
      switch (value) {
        case RoleOptions[0].key:
          this.setState({
            permissions: AdminDefaultPermissions
          });
          break;
        case RoleOptions[1].key:
          this.setState({
            permissions: TechincianDefaultPermissions
          });
          break;
        default:
          this.setState({
            permissions: {}
          });
          break;
      }
    }
  };
  addUser = e => {
    e.preventDefault();
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        roleType,
        rate,
        permissions,
        isEditMode
      } = this.state;
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        roleType,
        rate: rate ? parseFloat(rate.replace(/[$,\s]/g, "")).toFixed(2) : "0",
        permissions
      };
      const { isValid, errors } = Validator(
        payload,
        CreateUserValidations,
        CreateUserValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors
        });
        return;
      }
      if (!isEditMode) {
        this.props.addUser(payload);
      } else {
        this.props.updateUser(this.props.userData._id, payload);
      }
    } catch (error) {
      logger(error);
    }
  };
  render() {
    const { userModalOpen, handleUserModal } = this.props;
    const {
      permissions,
      firstName,
      lastName,
      email,
      phone,
      rate,
      roleType,
      errors,
      isEditMode
    } = this.state;
    return (
      <>
        <Form onSubmit={this.addUser}>
          <Modal
            isOpen={userModalOpen}
            toggle={handleUserModal}
            className="customer-modal custom-form-modal custom-modal-lg"
          >
            <ModalHeader toggle={handleUserModal}>
              {!isEditMode ? "Add New Member" : `Update member details`}
            </ModalHeader>
            <ModalBody>
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="John"
                      onChange={this.handleInputChange}
                      value={firstName}
                      name="firstName"
                      invalid={errors.firstName}
                    />
                    <FormFeedback>
                      {errors.firstName ? errors.firstName : null}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      placeholder="Doe"
                      onChange={this.handleInputChange}
                      value={lastName}
                      name="lastName"
                      invalid={errors.lastName}
                    />
                    <FormFeedback>
                      {errors.lastName ? errors.lastName : null}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Email
                    </Label>
                    <Input
                      type="text"
                      placeholder="john.doe@example.com"
                      onChange={this.handleInputChange}
                      value={email}
                      name="email"
                      disabled={isEditMode}
                      invalid={errors.email}
                    />
                    <FormFeedback>
                      {errors.email ? errors.email : null}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Phone (optional)
                    </Label>
                    <Input
                      type="text"
                      placeholder="(555) 055-0555"
                      id="phone"
                      onChange={this.handleInputChange}
                      value={phone}
                      name="phone"
                      invalid={errors.phone}
                    />
                    <FormFeedback>
                      {errors.phone ? errors.phone : null}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Type
                    </Label>
                    <Input
                      type="select"
                      className="customer-modal-text-style"
                      id="type"
                      onChange={this.handleInputChange}
                      value={roleType}
                      name="roleType"
                      invalid={errors.roleType}
                    >
                      {RoleOptions.map((role, index) => {
                        return (
                          <option value={role.key} key={index}>
                            {role.text}
                          </option>
                        );
                      })}
                    </Input>
                    <FormFeedback>
                      {errors.roleType ? errors.roleType : null}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Rate/hour (optional)
                    </Label>
                    <CurrencyInput
                      value={rate}
                      name={"rate"}
                      prefix="$"
                      onChangeEvent={this.handleInputChange}
                      className={classnames("form-control", {
                        "is-invalid": errors.rate
                      })}
                    />
                    <FormFeedback>
                      {errors.rate ? errors.rate : null}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Row className={"custom-label-padding "}>
                {roleType
                  ? UserPermissions.map((permission, index) => {
                      return (
                        <Col sm={"6"}>
                          <Row
                            className="justify-content-center pb-2"
                            key={index}
                          >
                            <Col md="2">
                              <AppSwitch
                                className={"mx-1"}
                                name={permission.key}
                                checked={permissions[permission.key]}
                                onClick={this.handleClick}
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
                          </Row>
                        </Col>
                      );
                    })
                  : null}
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addUser}>
                {isEditMode ? "Update" : "Add"} Member
              </Button>{" "}
              <Button color="secondary" onClick={handleUserModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Form>
      </>
    );
  }
}
