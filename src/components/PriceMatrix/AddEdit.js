import React, { Component } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback
} from "reactstrap";
class PriceMatrixComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false
    };
  }
  render() {
    const {
      matrixRange,
      handleAddBelowMatrixRange,
      handleCostChange,
      handleRemoveMatrixRange,
      handleAddMatrixRange,
      handleAddMatrix,
      matrixName,
      handleChange,
      errors,
      isEditMatrix,
      handleMatrixDelete
    } = this.props;
    return (
      <>
        <Row>
          <Col md={"12"} className={"mb-4"}>
            <div className={"matrix-input"}>
              <Input
                name="matrixName"
                value={matrixName}
                onChange={(e) => handleChange(0,e)}
                placeholder={"Example Matrix A"}
                invalid={errors.matrixName && !matrixName} />
              <FormFeedback>
                {
                  errors && errors.matrixName && !matrixName ?
                    errors.matrixName :
                    null
                }
              </FormFeedback>
              {
                isEditMatrix ?
                  <div className={"matrix-action"}>
                    <Button onClick={handleMatrixDelete} className={"btn btn-danger"}>
                      <i className="fas fa-trash" />
                    </Button>
                  </div> :
                  null
              }
            </div>
          </Col>
        </Row>
        <table className={"table"}>
          <thead>
            <tr>
              <th>Cost</th>
              <th className={"text-right"}>Markup</th>
              <th className={"text-right"}>Margin</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {matrixRange && matrixRange.length
              ? matrixRange.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr key={index}>
                      <td className={"justify-content-center"}>
                        <div
                          className={
                            "d-flex align-items-center matrix-input-control"
                          }
                        >
                          <div className={"d-inline-block"}>
                            <Input
                              className={"form-control text-right pr-0"}
                              name={"costPrice1"}
                              value={item.lower}
                              onChange={e => handleCostChange(index, e)}
                              disabled={item.lower === "0.00"}
                            />
                          </div>
                          <span className={"value-sprate"}>
                            <i className="far fa-window-minimize" />
                          </span>
                          <div className={"d-inline-block"}>
                            <Input
                              className={"form-control text-right pr-0"}
                              onChange={e => handleCostChange(index, e)}
                              name={"costPrice2"}
                              value={item.upper}
                              maxLength="6"
                              placeholder={"100.00%"}
                              disabled={item.upper === "beyond"}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          className={
                            "d-flex justify-content-end matrix-input-control"
                          }
                        >
                          <Input
                            className={"form-control text-right pr-0"}
                            value={item.markup}
                            name="markup"
                            maxLength="6"
                            onChange={(e) => handleChange(index, e)}
                            placeholder={"100.00%"}
                          />
                        </div>
                      </td>
                      <td>
                        <div
                          className={
                            "d-flex justify-content-end matrix-input-control"
                          }
                        >
                          <Input
                            className={"form-control text-right pr-0"}
                            value={item.margin}
                            name="margin"
                            onChange={(e) => handleChange(index, e)}
                            placeholder={"$0.00"}
                          />
                        </div>
                      </td>
                      <td className={"text-center"}>
                        <div className={"d-flex justify-content-center"}>
                          <span>
                            <UncontrolledDropdown>
                              <DropdownToggle caret>
                                <i className="fas fa-ellipsis-h" />
                              </DropdownToggle>
                              <DropdownMenu>
                                {index >= 1 ? (
                                  <DropdownItem
                                    onClick={() =>
                                      handleAddBelowMatrixRange(
                                        index,
                                        "above"
                                      )
                                    }
                                  >
                                    Add range above
                                    </DropdownItem>
                                ) : null}
                                <DropdownItem
                                  onClick={() =>
                                    handleAddBelowMatrixRange(index, "below")
                                  }
                                >
                                  Add range below
                                  </DropdownItem>
                                {index >= 1 ? (
                                  <DropdownItem>
                                    <span
                                      className={"btn btn-danger btn-round"}
                                      onClick={() =>
                                        handleRemoveMatrixRange(index)
                                      }
                                    >
                                      Delete &nbsp;{" "}
                                      <i className="fas fa-trash" />
                                    </span>
                                  </DropdownItem>
                                ) : null}
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </span>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
              : null}
          </tbody>
        </table>
        <Row>
          <Col md="6">
            <span
              onClick={handleAddMatrixRange}
              className="customer-add-phone customer-anchor-text customer-click-btn"
            >
              Add Range
            </span>
          </Col>
          <Col md={"6"} className={"text-right"}>
            <span
              onClick={() => handleAddMatrix()}
              className="btn btn-theme-line"
            >
              {
                isEditMatrix ? "Update" : "Save"
              }
            </span>
          </Col>
        </Row>
      </>
    );
  }
}

export default PriceMatrixComponent;
