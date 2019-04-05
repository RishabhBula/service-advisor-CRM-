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
  ForgetPasswordValidations,
  ForgetPasswordValidationsMessaages,
} from "../../validations";
class ForgotpasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errors: {},
    };
  }
  requestForgetpassword = e => {
    e.preventDefault();
    this.setState({
      errors: {},
    });
    try {
      const { isValid, errors } = Validator(
        this.state,
        ForgetPasswordValidations,
        ForgetPasswordValidationsMessaages
      );
      if (!isValid) {
        this.setState({
          errors,
        });
        return;
      }
      const { email } = this.state;
      this.props.onRequest({
        email,
      });
    } catch (error) {
      logger(error);
    }
  };
  render() {
    const { email, errors } = this.state;
    return (
      <div className="app flex-row align-items-center auth-page">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Col className="text-center">
                <Link to="/dashboard">
                  <h4 className="logo-title">CRM 360</h4>
                </Link>
              </Col>
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.requestForgetpassword}>
                      <h1 className="auth-title">Forgot Password?</h1>
                      <p className="text-muted">
                        Enter the email address associated with your account
                      </p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>@</InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="email"
                          placeholder="Email"
                          autoComplete="forgot-email"
                          name={"email"}
                          value={email}
                          onChange={e => {
                            this.setState({
                              email: e.target.value,
                              errors: {
                                ...this.state.errors,
                                email: null,
                              },
                            });
                          }}
                        />
                      </InputGroup>
                      {errors.email ? (
                        <p className={"text-danger"}>{errors.email}</p>
                      ) : null}
                      <Row>
                        <Col sm="12">
                          <Button
                            color="primary"
                            className="px-4"
                            block
                            onClick={this.requestForgetpassword}
                          >
                            Submit
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
                            Remember your password?
                            <Link to="/login"> Sign In </Link>
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

export default ForgotpasswordPage;
