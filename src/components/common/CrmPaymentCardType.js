import React, { Component } from "react";
import { Form } from "reactstrap";
export class CrmPaymentCardType extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <>
        <Form onSubmit={this.addPart}>
          Card Modal Workes
        </Form>
      </>
    );
  }
}
