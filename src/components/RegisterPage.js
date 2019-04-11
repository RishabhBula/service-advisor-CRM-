import Validator from "js-object-validation";
import React, { Component } from "react";
import Logo from "./../assets/img/logo-white.svg";

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

import { logger } from "../helpers/Logger";
import { SingupValidations, SingupValidationsMessaages } from "../validations";
import MailIcon from "./../assets/img/mail.png";
import { Link } from "react-router-dom";
const ResendInvitation = props => {
  return (
    <>
      <h1 className={"text-center"}>Confirmation Link Sent</h1>
      <img src={MailIcon} alt={"email-icon"} style={{ width: 80 }} />
      <p>
        Thank you for Signing Up!
        <br /> A Confirmation email has been sent to your Email address Kindly
        verify your account to Login
      </p>
      <Button color="primary" onClick={props.resendConfimationLink}>
        Resend
      </Button>
    </>
  );
};

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
      showResendPage: false
    };
  }
  componentDidMount() {
    localStorage.removeItem("userId");
  }
  componentDidUpdate() {
    const userId = localStorage.getItem("userId");
    const { showResendPage } = this.state;
    if (userId && !showResendPage) {
      this.setState({
        showResendPage: true
      });
    }
  }
  eventHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: { ...this.state.errors, [e.target.name]: null }
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      errors: {}
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
          isLoading: false
        });
        return;
      }
      const { firstName, lastName, email, password } = this.state;
      this.props.onSignup({ firstName, lastName, email, password });
    } catch (error) {
      logger(error);
    }
  };
  resendConfimationLink = e => {
    e.preventDefault();
    logger(localStorage.getItem("userId"));
    this.props.onResendLink({
      id: localStorage.getItem("userId")
    });
  };
  render() {
    const {
      errors,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      showResendPage
    } = this.state;
    return (
      <div className="app flex-row align-items-center auth-page">
        <Container>
          <Row className="justify-content-center">
            <Col md="6" lg="7" xl="6">
              <Col className="text-center">
                <h4 className="logo-title">
                  <img src={Logo} alt={"logo"} style={{ width: 80 }} />
                </h4>
              </Col>
              <CardGroup>
              <Card className="mx-4">
                <CardBody className="p-4">
                  {!showResendPage ? (
                    <Form onSubmit={this.handleSubmit}>
                      <h1 className="auth-title">Create your account</h1>
                      <p />
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
                          placeholder="Confirm password"
                          autoComplete="new-password"
                          onChange={this.eventHandler}
                          name="confirmPassword"
                          value={confirmPassword}
                        />
                      </InputGroup>
                      {errors.confirmPassword ? (
                        <p className={"text-danger"}>
                          {errors.confirmPassword}
                        </p>
                      ) : null}
                      <Row>
                        <Col sm="6">
                          <Button
                            color="primary"
                            className="px-4"
                            type="submit"
                            block
                            onClick={this.handleSubmit}
                          >
                            Signup
                          </Button>
                        </Col>
                      </Row>
                      <Row className="d-block mt-2">
                        <Col
                          xs="12"
                          sm={"12"}
                          md={"12"}
                          className="login-or-section text-center mt-2 mb-2"
                        >
                          <span>OR</span>
                        </Col>
                        <Col xs="12">
                          <p className="text-center">
                            Already have an account?
                            <Link to="/login"> Sign In </Link>
                          </p>
                        </Col>
                      </Row>
                    </Form>
                  ) : (
                    <ResendInvitation
                      resendConfimationLink={this.resendConfimationLink}
                    />
                  )}
                </CardBody>
              </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default RegisterPage;
