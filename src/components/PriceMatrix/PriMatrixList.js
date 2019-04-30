import React, { Component } from "react";
import { Col, Button, UncontrolledTooltip } from "reactstrap";
class PriMatrixList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        Price Matrix Body
        <Col sm={"12"} className={"text-center"}>
          <Button color="primary" id="add-user" className={"btn btn-round"}>
            New Matrix
          </Button>
          <UncontrolledTooltip target={"add-user"}>
            New Price Matrix
          </UncontrolledTooltip>
        </Col>
      </>
    );
  }
}

export default PriMatrixList;
