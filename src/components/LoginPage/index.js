import Validator from "js-object-validation";

import React, { Component } from "react";
import { Link } from "react-router-dom";
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
  Row,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import { logger } from "../../helpers/Logger";
import { LoginValidations, LoginValidationsMessaages } from "../../validations";
import Logo from "./../../assets/serviceadvisorlogo.jpg";
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }
  handleChange = e => {
    const { target } = e;
    e.preventDefault();
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: false,
      },
    });
  };
  login = e => {
    e.preventDefault();
    this.setState({
      errors: {},
    });
    try {
      const { isValid, errors } = Validator(
        this.state,
        LoginValidations,
        LoginValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors,
          isLoading: false,
        });
        return;
      }
      const { email, password } = this.state;
      this.props.onLogin({
        email,
        password,
      });
    } catch (error) {
      logger(error);
    }
  };
  render() {
    const { email, password, errors } = this.state;
    return (
      <div className="app flex-row align-items-center auth-page">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Col className="text-center">
                <h4 className="logo-title">
                  <img src={Logo} alt={"logo"} style={{ width: 80 }} />
                </h4>
              </Col>
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.login}>
                      <h1 className="auth-title">Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <FormGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Email"
                            autoComplete="username"
                            name={"email"}
                            value={email}
                            onChange={this.handleChange}
                            invalid={errors.email}
                          />
                          <FormFeedback>
                            {errors.email ? errors.email : null}
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
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            name={"password"}
                            value={password}
                            onChange={this.handleChange}
                            invalid={errors.password}
                          />
                          <FormFeedback>
                            {errors.password ? errors.password : null}
                          </FormFeedback>
                        </InputGroup>
                      </FormGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" block>
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Link to="/forgot-password">
                            <Button color="link" className="px-0">
                              Forgot password?
                            </Button>
                          </Link>
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
                          {/* <Button className="btn-facebook btn-brand mr-1 mb-1" block><i className="fa fa-facebook"></i><span>Facebook</span></Button> */}
                          <p className="text-center">
                            Don't have an account?{" "}
                            <Link to="/register">Sign Up </Link>
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

export default LoginPage;
