import Validator from "js-object-validation";
import React, { Component } from "react";

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
  FormFeedback,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";

import { logger } from "../helpers/Logger";
import { SingupValidations, SingupValidationsMessaages } from "../validations";
import MailIcon from "./../assets/img/mail-icon.svg";
import { Link } from "react-router-dom";
import { validUrlCheck, isValidSubdomain } from "../helpers/Object";
// import ServiceAdvisorLogo from "../assets/logo-white.svg";
import HomeHeader from "./HomePage/homeHeader";
import HomeFooter from "./HomePage/homeFooter";
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
      showResendPage: false,
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
      [e.target.name]:
        e.target.name === "workspace"
          ? e.target.value.toLowerCase()
          : e.target.value,
      errors: { ...this.state.errors, [e.target.name]: null }
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      errors: {}
    });
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        companyLogo,
        companyName,
        companyWebsite,
        workspace,
        confirmPassword
      } = this.state;
      const d = {
        firstName,
        lastName,
        email,
        password,
        companyLogo,
        companyName,
        companyWebsite,
        workspace,
        confirmPassword
      };
      let { isValid, errors } = Validator(
        d,
        SingupValidations,
        SingupValidationsMessaages
      );
      if (d.companyWebsite && !validUrlCheck(d.companyWebsite)) {
        errors.companyWebsite = "Please enter a valid URL. Include http:// or https://";
        isValid = false;
      }
      if (d.workspace && !isValidSubdomain(d.workspace)) {
        errors.workspace = "Workspace can only have a-z, 0-9 and -";
        isValid = false;
      }
      if (d.password && !errors.password) {
        let res = (d.password).match(/^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i);
        if (!res) {
          isValid = false;
          errors.password = "Password should have both alpha & numeric characters."
        }
      }
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false
        });
        return;
      }

      this.props.onSignup(d);
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
  onBlur = () => {
    if (this.state.workspace === "") {
      this.setState({
        workspace: (this.state.companyName).replace(/\s/g, '').replace(/[^\w\s]/gi, '_').toLowerCase()
      })
    }
  }
  render() {
    const { settingData } = this.props
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
      <>
        <div className="faq-section">
          <HomeHeader />
        </div>
        <div className="app app1 flex-row align-items-center auth-page pt-3 pb-3">
          <div className="auth-bg" />
          <Row className="justify-content-center m-0">
            <Col md="12" lg="12" xl="12">
              {/* <Col className="text-center">
              <h4 className="logo-title">
                <img
                  src={ServiceAdvisorLogo}
                  alt={"logo"}
                  style={{ width: 120 }}
                />
              </h4>
            </Col> */}
              <CardGroup>
                <Card className="p-4 pl-4 pr-4 card">
                  <CardBody className="pl-4 pr-4 pt-0 pb-0">
                    {!showResendPage ? (
                      <Form onSubmit={this.handleSubmit}>
                        <h1 className="auth-title">Sign Up</h1>
                        <p className="text-muted text-center text-info-line">
                          To Create Your Workspace
                      </p>
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup className="mb-3">
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.firstName ? "invalid" : " "}
                            >
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
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup className="mb-3">
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.lastName ? "invalid" : " "}
                            >
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
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup className="mb-3">
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.email ? "invalid" : " "}
                            >
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
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup className="mb-3">
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.password ? "invalid" : " "}
                            >
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
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup>
                            <InputGroupAddon
                              addonType="prepend"
                              className={
                                errors.confirmPassword ? "invalid" : " "
                              }
                            >
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
                        <FormGroup
                          className={"position-relative auth-input-group"}
                        >
                          <InputGroup>
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.companyName ? "invalid" : " "}
                            >
                              <InputGroupText>
                                <i className="icons cui-shield" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Company Name"
                              autoComplete="company-name"
                              onChange={this.eventHandler}
                              name="companyName"
                              value={companyName}
                              onBlur={this.onBlur}
                              invalid={errors.companyName}
                            />
                            <FormFeedback>
                              {errors.companyName ? errors.companyName : null}
                            </FormFeedback>
                          </InputGroup>
                          <Button
                            id={"company"}
                            className={"help-btn rounded-circle"}
                          >
                            <i className={"fa fa-question"} />
                          </Button>
                          <UncontrolledPopover
                            className={"technician-popover"}
                            placement="top"
                            target={"company"}
                            trigger={"hover"}
                          >
                            <PopoverHeader>Company Name</PopoverHeader>
                            <PopoverBody>
                              <div className={"pb-2 technician-detail"}>
                                <div
                                  className={
                                    "text-capitalize pb-1 border-bottom"
                                  }
                                >
                                  Provide name of your company or Organization
                              </div>
                                <div className={"pt-2  text-note text-left"}>
                                  ex.&nbsp;serviceadvisor
                              </div>
                              </div>
                            </PopoverBody>
                          </UncontrolledPopover>
                        </FormGroup>
                        <FormGroup
                          className={"position-relative auth-input-group"}
                        >
                          <InputGroup>
                            <InputGroupAddon
                              addonType="prepend"
                              className={errors.workspace ? "invalid" : " "}
                            >
                              <InputGroupText>
                                <i className="icons cui-monitor" />
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
                          <Button
                            id={"workspace"}
                            className={"help-btn rounded-circle"}
                          >
                            <i className={"fa fa-question"} />
                          </Button>
                          <UncontrolledPopover
                            className={"technician-popover"}
                            placement="top"
                            target={"workspace"}
                            trigger={"hover"}
                          >
                            <PopoverHeader>Workspace ?</PopoverHeader>
                            <PopoverBody>
                              <div className={"pb-2 technician-detail"}>
                                <div
                                  className={
                                    "text-capitalize pb-1 border-bottom"
                                  }
                                >
                                  Name of dedicated space provide for your
                                  company.
                              </div>
                                <div className={"pt-2  text-note text-left"}>
                                  Will Assign a seprate subdomain
                                <br />
                                  ex.&nbsp;
                                  http://comanyname.serviceadvisor.io
                              </div>
                              </div>
                            </PopoverBody>
                          </UncontrolledPopover>
                        </FormGroup>
                        <FormGroup className={"auth-input-group"}>
                          <InputGroup className="mb-4">
                            <InputGroupAddon
                              addonType="prepend"
                              className={
                                errors.companyWebsite ? "invalid" : " "
                              }
                            >
                              <InputGroupText>
                                <i className="icons cui-globe" />
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
        <div>
          <HomeFooter settingData={settingData} />
        </div>
      </>
    );
  }
}

export default RegisterPage;
