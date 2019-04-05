import React, { Component } from "react";
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                <h4>
                  <i className="fa fa-dashboard" /> Dashboard
                </h4>
              </CardHeader>
              <CardBody>
                <h4 className={"text-center"}>Coming Soon</h4>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
