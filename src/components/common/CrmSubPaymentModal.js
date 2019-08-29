import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  ModalFooter,
  Button,
  Label,
  FormGroup,
  FormFeedback,
  Col
} from "reactstrap";
import MaskedInput from "react-text-mask";
import * as classnames from "classnames";

export class CrmSubPaymentModalModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvv: "",
      expireDate: "",
      expireYearError: "",
      expireMonthError: ""
    };
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
    if (name === "expireDate") {
      const expireDate = value.split('/')
      this.setState({
        expMonth: expireDate[0],
        expYear: expireDate[1]
      })
    }
  }
  handleSubscriptionPayment = () => {
    const { cardNumber, expMonth, expYear, cvv } = this.state
    const payload = {
      planId: this.props.planId,
      cardNumber: cardNumber,
      expMonth: expMonth,
      expYear: expYear,
      cvv: cvv
    }
    let isError = false
    var d = new Date();
    var n = d.getYear();
    if (parseInt(payload.expMonth) > 12 && payload.expYear) {
      this.setState({
        expireMonthError: "Enter valid month."
      })
      isError = true
      console.log("@@@@@@@@@@");

    }
    else if (parseInt(payload.expYear) < n && payload.expYear) {
      this.setState({
        expireYearError: "Expiretion year should be greater than current year",
        expireMonthError: null
      })
      isError = true
      console.log("!!!!!!!!!");
    } else {
      this.setState({
        expireYearError: "",
        expireMonthError: ""
      })
      console.log("%%%%%%%%");
      isError = false
    }
    console.log("################", isError);

    if (!isError) {
      this.props.addSubscriptionRequest(payload)
    }
  }
  render() {
    const { openSubPayementModel, handleSubPaymentModal } = this.props
    const { cardNumber, cvv, expireDate, expireMonthError, expireYearError } = this.state
    return (
      <>
        <Modal
          isOpen={openSubPayementModel}
          className='customer-modal custom-form-modal'
          backdrop={"static"}
        >
          <ModalHeader toggle={handleSubPaymentModal}>Subscription Payment</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubscriptionPayment}>
              <div>
                <Col md={"12"}>
                  <FormGroup>
                    <Label />
                    <div className="stripImg">
                      <img src="/assets/img/stripe-img.jpg" alt="stripe-img" />
                    </div>
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup>
                    <Label>Card Number</Label>
                    <MaskedInput
                      mask={[
                        /[0-9]/,
                        /\d/,
                        /\d/,
                        /\d/,
                        ' ',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        ' ',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        ' ',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                      ]}
                      className={'form-control'}
                      placeholder="Enter card number"
                      value={cardNumber}
                      name="cardNumber"
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
                <div className="clearfix">
                  <Col md={"12"}>
                    <FormGroup>
                      <Label htmlFor="expiry">Expiration</Label>
                      <div className={"input-block"}>
                        <MaskedInput
                          mask={[/[0-9]/, /\d/, '/', /\d/, /\d/]}
                          className={classnames("form-control", {
                            "is-invalid":
                              (expireYearError || expireMonthError) &&
                              expireDate
                          })}
                          placeholder="Enter expiry date"
                          id="expireDate"
                          name="expireDate"
                          value={expireDate}
                          onChange={this.handleChange}

                        />
                        <FormFeedback>
                          {expireYearError ? expireYearError : null}
                        </FormFeedback>
                        <FormFeedback>
                          {expireMonthError ? expireMonthError : null}
                        </FormFeedback>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={"12"}>
                    <FormGroup>
                      <Label htmlFor="cvv">CVC / CVV Number</Label>
                      <MaskedInput
                        mask={[/[0-9]/, /\d/, /\d/]}
                        className={'form-control'}
                        placeholder="Enter CVV"
                        id="cvv"
                        name="cvv"
                        value={cvv}
                        onChange={this.handleChange}
                      />
                    </FormGroup>
                  </Col>
                </div>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter>
            <div>
              <Button onClick={this.handleSubscriptionPayment} color="primary">Subscribe</Button>
            </div>
            <div>
              <Button onClick={handleSubPaymentModal} color="secondary">Cancel</Button>
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}