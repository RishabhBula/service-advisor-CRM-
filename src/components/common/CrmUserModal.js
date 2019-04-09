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
  Input,
  Form
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
  UserPermissions
} from "../../config/Constants";

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
      errors: {}
    };
  }
  componentDidUpdate({ userModalOpen }) {
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
  }
  handleClick = e => {
    this.setState({
      switchValue: e.target.checked ? "checked" : "no"
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
    if (name === "type") {
      switch (value) {
        case "5ca3473d70537232f13ff1f9":
          this.setState({
            permissions: AdminDefaultPermissions
          });
          break;
        case "5ca3473d70537232f13ff1fa":
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
        permissions
      } = this.state;
      const payload = {
        firstName,
        lastName,
        email,
        phone,
        roleType,
        rate,
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
      this.props.addUser(payload);
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
      errors
    } = this.state;
    return (
      <>
        <Form onSubmit={this.addUser}>
          <Modal
            isOpen={userModalOpen}
            toggle={handleUserModal}
            className="customer-modal"
          >
            <ModalHeader toggle={handleUserModal}>Add New Member</ModalHeader>
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
                      required
                    />
                  </FormGroup>
                  {errors.firstName ? (
                    <p className={"text-danger"}>{errors.firstName}</p>
                  ) : null}
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
                      required
                    />
                  </FormGroup>
                  {errors.lastName ? (
                    <p className={"text-danger"}>{errors.lastName}</p>
                  ) : null}
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
                      required
                    />
                  </FormGroup>
                  {errors.email ? (
                    <p className={"text-danger"}>{errors.email}</p>
                  ) : null}
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
                    />
                  </FormGroup>
                  {errors.phone ? (
                    <p className={"text-danger"}>{errors.phone}</p>
                  ) : null}
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="12">
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
                    >
                      <option value="5ca3473d70537232f13ff1f9">Admin</option>
                      <option value="5ca3473d70537232f13ff1fa">
                        Technician
                      </option>
                    </Input>
                  </FormGroup>
                  {errors.roleType ? (
                    <p className={"text-danger"}>{errors.roleType}</p>
                  ) : null}
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="12">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Rate (optional)
                    </Label>
                    <Input
                      type="text"
                      id="rate"
                      onChange={this.handleInputChange}
                      value={rate}
                      name="rate"
                    />
                  </FormGroup>
                  {errors.rate ? (
                    <p className={"text-danger"}>{errors.rate}</p>
                  ) : null}
                </Col>
              </Row>
              {roleType
                ? UserPermissions.map((permission, index) => {
                    return (
                      <Row className="justify-content-center pb-2" key={index}>
                        <Col md="2">
                          <AppSwitch
                            className={"mx-1"}
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
                    );
                  })
                : null}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addUser}>
                Add
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
