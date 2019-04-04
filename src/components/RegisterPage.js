import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  }

  eventHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

 
  render() {
    return (
      <div className="app flex-row align-items-center auth-page">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Col className="text-center">
                <Link to="/dashboard">
                  <h4 className="logo-title">CRM 360</h4>
                </Link>
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
                        name="firstName"
                      />
                    </InputGroup>
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
                        name="lastName"
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Email"
                        autoComplete="email"
                        onChange={this.eventHandler}
                        name="email"
                      />
                    </InputGroup>
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
                        name="password"
                      />
                    </InputGroup>
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
                      />
                    </InputGroup>
                    <Button color="primary" block>
                      Start Now
                    </Button>
                    <Col
                      xs="12"
                      className="login-or-section text-center mt-2 mb-2"
                    >
                      <span>OR</span>
                    </Col>
                    <Link to="/login" className="mt-2 d-block">
                      <Button color="secondary" block>
                        Login
                      </Button>
                    </Link>
                  </Form>
                </CardBody>
                {/* <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block>
                        <span>facebook</span>
                      </Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block>
                        <span>twitter</span>
                      </Button>
                    </Col>
                  </Row>
                </CardFooter> */}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default RegisterPage;
