import Validator from "js-object-validation";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
} from "reactstrap";
import { logger } from "../../helpers/Logger";
import {
  ResetPasswordValidations,
  ResetPasswordValidationsMessaages,
} from "../../validations/login";
class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      errors: {},
    };
  }
  handleInputChange = e => {
    const { target } = e;
    const { value, name } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null,
      },
    });
  };
  resetPassword = e => {
    e.preventDefault();
    this.setState({
      errors: {},
    });
    try {
      const { isValid, errors } = Validator(
        this.state,
        ResetPasswordValidations,
        ResetPasswordValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors,
        });
        return;
      }
      const { password } = this.state;
      const { token, user, verification } = this.props;
      this.props.requestChangePassword({
        password,
        token,
        user,
        verification,
      });
    } catch (error) {
      logger(error);
    }
  };
  render() {
    const { password, confirmPassword, errors } = this.state;
    return (
      <div className="app flex-row align-items-center auth-page">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Col className="text-center">
                <h4 className="logo-title">CRM 360</h4>
              </Col>
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.resetPassword}>
                      <h1 className="auth-title">Reset Password</h1>
                      <p className="text-muted">With your Account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="username"
                          name={"password"}
                          value={password}
                          onChange={this.handleInputChange}
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
                          placeholder="Confirm Password"
                          autoComplete="confirm-password"
                          name={"confirmPassword"}
                          value={confirmPassword}
                          onChange={this.handleInputChange}
                        />
                      </InputGroup>
                      {errors.confirmPassword ? (
                        <p className={"text-danger"}>
                          {errors.confirmPassword}
                        </p>
                      ) : null}
                      <Row>
                        <Col xs="12">
                          <Button
                            color="primary"
                            className="px-4"
                            block
                            onClick={this.resetPassword}
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                      <Row className="d-block mt-2">
                        <Col
                          xs="12"
                          className="login-or-section text-center mt-2 mb-2"
                        >
                          <span>OR</span>
                        </Col>
                        <Col xs="12">
                          <p className="text-center">
                            If you have remember?{" "}
                            <Link to="/login">Sign In </Link>
                          </p>
                        </Col>
                      </Row>
                    </Form>
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

export default ResetPasswordPage;
