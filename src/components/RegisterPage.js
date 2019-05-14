import Validator from "js-object-validation";
import React, { Component } from "react";
import Logo from "./../assets/img/logo-white.svg";

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  FormGroup,
  FormFeedback
} from "reactstrap";

import { logger } from "../helpers/Logger";
import { SingupValidations, SingupValidationsMessaages } from "../validations";
import MailIcon from "./../assets/img/mail-icon.svg";
import { Link } from "react-router-dom";
const ResendInvitation = props => {
  return (
    <div className={"confirm-block"}>
      <h1 className={"text-center"}>Confirmation Link Sent</h1>
      <div className={"pt-2 pb-2 pr-2 text-center icon-block"}>
        <img
          src={MailIcon}
          alt={"email-icon"}
          style={{ width: 150, height: 150 }}
        />
      </div>
      <h4 className={"text-center"}>Thank you for Signing Up!</h4>
      <p className="confirm-text">
        A Confirmation email has been sent to your Email address.
        <br /> Kindly verify your account to Login.
      </p>
      <div className="text-center">
        <Button
          color="primary"
          className={"px-4 btn-theme"}
          onClick={props.resendConfimationLink}
        >
          Resend Link
        </Button>
      </div>
    </div>
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
      companyName: "",
      workspace: "",
      companyWebsite: "",
      companyLogo: "",
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
      const {
        firstName,
        lastName,
        email,
        password,
        companyLogo,
        companyName,
        companyWebsite,
        workspace
      } = this.state;
      this.props.onSignup({
        firstName,
        lastName,
        email,
        password,
        companyLogo,
        companyName,
        companyWebsite,
        workspace
      });
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
      showResendPage,
      companyName,
      workspace,
      companyWebsite
    } = this.state;
    return (
      <div className="app flex-row align-items-center auth-page pt-3 pb-3">
        <div className="auth-bg" />

        <Row className="justify-content-center m-0">
          <Col md="12" lg="12" xl="12">
            <Col className="text-center">
              <h4 className="logo-title">
                <img src={Logo} alt={"logo"} style={{ width: 120 }} />
              </h4>
            </Col>
            <CardGroup>
              <Card className="p-4 pl-4 pr-4 card">
                <CardBody className="pl-4 pr-4 pt-0 pb-0">
                  {!showResendPage ? (
                    <Form onSubmit={this.handleSubmit}>
                      <h1 className="auth-title">Sign Up</h1>
                      <p className="text-muted text-center text-info-line">
                        To Create Your Workspace
                      </p>
                      <FormGroup>
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
                            invalid={errors.firstName}
                          />
                          <FormFeedback>
                            {errors.firstName ? errors.firstName : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
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
                            invalid={errors.lastName}
                          />
                          <FormFeedback>
                            {errors.lastName ? errors.lastName : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
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
                            invalid={errors.email}
                          />
                          <FormFeedback>
                            {errors.email ? errors.email : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
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
                            invalid={errors.password}
                          />
                          <FormFeedback>
                            {errors.password ? errors.password : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
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
                            invalid={errors.confirmPassword}
                          />
                          <FormFeedback>
                            {errors.confirmPassword
                              ? errors.confirmPassword
                              : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Company Name"
                            autoComplete="company-name"
                            onChange={this.eventHandler}
                            name="companyName"
                            value={companyName}
                            invalid={errors.companyName}
                          />
                          <FormFeedback>
                            {errors.companyName ? errors.companyName : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Workspace"
                            autoComplete="new-workspace"
                            onChange={this.eventHandler}
                            name="workspace"
                            value={workspace}
                            invalid={errors.workspace}
                          />
                          <FormFeedback>
                            {errors.workspace ? errors.workspace : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Company Website"
                            autoComplete="new-company-website"
                            onChange={this.eventHandler}
                            name="companyWebsite"
                            value={companyWebsite}
                            invalid={errors.companyWebsite}
                          />
                          <FormFeedback>
                            {errors.companyWebsite
                              ? errors.companyWebsite
                              : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <Row className={"m-0"}>
                        <Col xs="8" className={"mt-0 mb-0 ml-auto mr-auto"}>
                          <Button
                            color="primary"
                            className="px-4 btn-theme"
                            type="submit"
                            block
                            onClick={this.handleSubmit}
                          >
                            Signup
                          </Button>
                        </Col>
                      </Row>
                      <Row className="d-block mt-3 m-0">
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
      </div>
    );
  }
}

export default RegisterPage;
