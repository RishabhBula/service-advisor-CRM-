import Validator from "js-object-validation";
import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";

import { logger } from "../helpers/Logger";
import { SingupValidations, SingupValidationsMessaages } from "../validations";

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      isLoading: false,
    };
  }

  eventHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: { ...this.state.errors, [e.target.name]: null },
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      errors: {},
    });
    try {
      const { isValid, errors } = Validator(
        this.state,
        SingupValidations,
        SingupValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false,
        });
        return;
      }
      const { firstName, lastName, email, password } = this.state;
      this.props.onSignup({ firstName, lastName, email, password });
    } catch (error) {
      logger(error);
    }
  };

  render() {
    const {
      errors,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
    } = this.state;
    return (
      <div className="app flex-row align-items-center auth-page">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Col className="text-center">
                <h4 className="logo-title">CRM 360</h4>
              </Col>
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.handleSubmit}>
                    <h1 className="auth-title">Start Your Free Trial</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="First Name"
                        autoComplete="first-name"
                        onChange={this.eventHandler}
                        value={firstName}
                        name="firstName"
                      />
                    </InputGroup>
                    {errors.firstName ? (
                      <p className={"text-danger"}>{errors.firstName}</p>
                    ) : null}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        autoComplete="last-name"
                        onChange={this.eventHandler}
                        value={lastName}
                        name="lastName"
                      />
                    </InputGroup>
                    {errors.lastName ? (
                      <p className={"text-danger"}>{errors.lastName}</p>
                    ) : null}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Email"
                        autoComplete="email"
                        onChange={this.eventHandler}
                        value={email}
                        name="email"
                      />
                    </InputGroup>
                    {errors.email ? (
                      <p className={"text-danger"}>{errors.email}</p>
                    ) : null}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        onChange={this.eventHandler}
                        value={password}
                        name="password"
                      />
                    </InputGroup>
                    {errors.password ? (
                      <p className={"text-danger"}>{errors.password}</p>
                    ) : null}
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        onChange={this.eventHandler}
                        name="confirmPassword"
                        value={confirmPassword}
                      />
                    </InputGroup>
                    {errors.confirmPassword ? (
                      <p className={"text-danger"}>{errors.confirmPassword}</p>
                    ) : null}
                    <Button color="primary" block>
                      Start Now
                    </Button>
                    <Col
                      xs="12"
                      className="login-or-section text-center mt-2 mb-2"
                    >
                      <span>OR</span>
                    </Col>
                    <Button
                      color="secondary"
                      block
                      onClick={() => {
                        this.props.redirectTo("/login");
                      }}
                    >
                      Login
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default RegisterPage;
