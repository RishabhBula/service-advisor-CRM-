import React, { Component } from "react";
import { Col, Button, UncontrolledTooltip } from "reactstrap";
class PriMatrixList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { matrixList, handleUpdateMatrix, addNewMatrix, activeMatrix } = this.props;
    return (
      <>
        <ul className={"matrix-list p-0"}>
          {
            matrixList && matrixList.length ? matrixList.map((martix, index) => {
              return (
                <li key={index} className={activeMatrix === martix._id ? "text-capitalize active" : "text-capitalize"} onClick={() => handleUpdateMatrix(martix)}>
                  <i className={"icons icon-arrow-right"} /> {martix && martix.matrixName ? martix.matrixName : "New Matrix"}
                </li>
              )
            }) :
              null
          }
        </ul>
        <Col sm={"12"} className={"text-center matrix-btn-block"}>
          <Button id="add-user" onClick={() => addNewMatrix()} className={"btn btn-round btn-theme-line"}>
            <i class="fa fa-plus"></i> New Matrix
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
