import React, { Component } from "react";
import { Row, Col } from "reactstrap";

class CardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { icon, text, value } = this.props;
    return (
      <div className={"main-card dashboard-block-container"}>
        <Row>
          <Col sm={"4"}>
            <img src={icon} alt="" />
          </Col>
          <Col sm={"8"}>
            <h3>{text}</h3>
            <p>{value}</p>
          </Col>
        </Row>
        <hr />
        <div className={"anchor-container"}>
          <a href={"/"} onClick={e => e.preventDefault()}>
            View Details
          </a>
        </div>
      </div>
    );
  }
}

export default CardComponent;
