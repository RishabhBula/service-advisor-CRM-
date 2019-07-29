import React, { Component } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  CustomInput
} from "reactstrap";
import "./index.scss"
export class SendEmailAndSMS extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { headingTitle, handleReminder, isEmail, isSms, email, phone } = this.props
    return (
      <div className="text-center email-sms-section">
        <h3 className={"pb-2 pt-2"}>{headingTitle}</h3>
        <img src={"/assets/img/email.svg"} width={"70"} alt={"Email"} />
        <Row className={"text-center pt-2"}>
          <Col className={"pl-3"}>
            <FormGroup className={"pl-5"}>
              <Label for={"Email-check"}>Email</Label>
              <CustomInput
                checked={isEmail}
                name={"isEmail"}
                onChange={(e) => handleReminder(e)}
                disabled={!email}
                id={"Email-check"}
                type={"checkbox"} />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for={"SMS-check"}>SMS</Label>
              <CustomInput
                id={"SMS-check"}
                name={"isSms"}
                disabled={!phone}
                onChange={(e) => handleReminder(e)}
                checked={isSms}
                type={"checkbox"} />
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}
