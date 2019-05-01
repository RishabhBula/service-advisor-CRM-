import React, { Component } from "react";
import { Col, Button, UncontrolledTooltip } from "reactstrap";
class PriMatrixList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { matrixList, handleUpdateMatrix, resetAll } = this.props;
    return (
      <>
        {
          matrixList && matrixList.length ? matrixList.map((martix, index) => {
            return (
              <div key={index}>
                <span onClick={() => handleUpdateMatrix(martix)}>
                  {martix && martix.matrixName ? martix.matrixName : "New Matrix"}
                </span>
              </div>
            )
          }) :
            null
        }
        <Col sm={"12"} className={"text-center"}>
          <Button color="primary" id="add-user" onClick={() => resetAll()} className={"btn btn-round"}>
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
