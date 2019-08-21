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
  Col
} from "reactstrap";
import MaskedInput from "react-text-mask";

export class CrmSubPaymentModalModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvv: "",
      expireDate: ""
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
    console.log(payload, "addSubscriptionRequest");
    this.props.addSubscriptionRequest(payload)
  }
  render() {
    const { openSubPayementModel, handleSubPaymentModal } = this.props
    const { cardNumber, cvv, expireDate } = this.state
    return (
      <>
        <Modal
          isOpen={openSubPayementModel}
          className='customer-modal custom-form-modal'
          backdrop={"static"}
        >
          <ModalHeader toggle={handleSubPaymentModal}>Subscription Payment</ModalHeader>
          <ModalBody>
            <Form>
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
                      <MaskedInput
                        mask={[/[0-9]/, /\d/, '/', /\d/, /\d/]}
                        className={'form-control'}
                        placeholder="Enter expiry date"
                        id="expireDate"
                        name="expireDate"
                        value={expireDate}
                        onChange={this.handleChange}
                      />
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