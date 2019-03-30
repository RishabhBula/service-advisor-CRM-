import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class ForGotPassword extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center auth-page">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Col className="text-center">
                <Link to="/dashboard">
                  <h4 className="logo-title">CRM 360</h4>
                </Link>
                {/* <img
                  src="https://www.pngkey.com/png/detail/139-1395618_crm-icon-png-clipart-customer-relationship-management-crm.png"
                  alt="log"
                  className="logo-img"
                /> */}
              </Col>
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
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
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" block>
                            Submit
                          </Button>
                        </Col>
                        {/* <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col> */}
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
                            Remember your password?
                            <Link to="/login"> Sign In </Link>
                          </p>
                          {/* <Link to="/register">
                            <Button color="secondary" block>
                              Don't have an account? Sign Up
                            </Button>
                          </Link> */}
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                {/* <Card
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua.
                      </p>
                      <Link to="/register">
                        <Button
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card> */}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ForGotPassword;
