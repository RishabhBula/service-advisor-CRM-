import React, { Component } from "react";

import { Col, Row, Card, CardBody, Button } from "reactstrap";
import WorkflowGridView from "../../components/Workflow/GridView";

class WorkFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Card className={"white-card position-relative"}>
        <CardBody>
          <Row className={"mb-4"}>
            <Col className={"title-left-section"}>
              <h4 className={"card-title"}>WorkFlow</h4>
              <div className={"workflow-mode"}>
                <div className={"mode-inner"}>
                  <div className={"mode-flow"}>
                    <button
                      className={"nav-icon icon-list btn btn-outline-dark"}
                    />
                  </div>
                  <div className="mode-flow">
                    <button
                      className={"nav-icon icon-grid btn btn-outline-dark"}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col className={"title-right-section invt-add-btn-block"}>
              <Button color={"primary"} id={"add-Appointment"}>
                <i className={"fa fa-plus mr-1"} /> New Quote
              </Button>
            </Col>
          </Row>
          <Row>
            <Col sm={"12"}>
              <WorkflowGridView />
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default WorkFlow;
