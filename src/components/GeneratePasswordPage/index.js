import Validator from "js-object-validation";
import React, { Component } from "react";
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
} from "../../validations";
import Logo from "./../../assets/serviceadvisorlogo.jpg";

class GeneratePasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
      errors: {},
    };
  }
  componentDidMount() {
    logger(this.props);
  }
  generatePassword = e => {
    e.preventDefault();
    try {
      const { password, confirmPassword } = this.state;
      const payload = { password, confirmPassword };
      const { isValid, errors } = Validator(
        payload,
        ResetPasswordValidations,
        ResetPasswordValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors,
        });
        return;
      }
      this.props.onGenerate(password);
    } catch (error) {
      logger(error);
    }
  };
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
  render() {
    const { password, confirmPassword, errors } = this.state;
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
                    <Form onSubmit={this.generatePassword}>
                      <h1 className="auth-title">Generate Password</h1>
                      <p className="text-muted">for your Account</p>
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
                            onClick={this.generatePassword}
                          >
                            Submit
                          </Button>
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

export default GeneratePasswordPage;
