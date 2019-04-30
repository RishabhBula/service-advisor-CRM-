import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Input,
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { logger } from "../../helpers/Logger";
class PriceMatrix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matrixList: {},
      isEditable: false,
      matrixRange: [
        {
          margin: "",
          markup: "",
          lower: '0.00',
          upper: 'beyond',
        }
      ],
      martrixName: "",
    }
  }
  handleAddMatrixRange = () => {
    const { matrixRange } = this.state;
    const upper = "beyond";
    const lower = parseFloat(matrixRange[matrixRange.length - 1].lower) + 100;
    matrixRange[matrixRange.length - 1].upper = parseFloat(matrixRange[matrixRange.length - 1].lower) + 99;
    matrixRange.push({
      margin: "",
      markup: "",
      lower,
      upper
    })
    this.setState({
      matrixRange
    })
  }
  handleCostChange = (index, e) => {
    const { name, value } = e.target
    if (name === 'costPrice1') {
      const matrixRange = [...this.state.matrixRange];
      matrixRange[index].lower = value
      matrixRange[index - 1].upper = parseInt(value) - 0.01
      this.setState({
        matrixRange
      })
    } else {
      const matrixRange = [...this.state.matrixRange];
      matrixRange[index].upper = value
      matrixRange[index + 1].lower = parseInt(value) + 0.01
      this.setState({
        matrixRange
      })
    }
  }
  handleRemoveMatrixRange = index => {
    const { matrixRange } = this.state;
    let t = [...matrixRange];
    t[index - 1].upper =
      t && t.length && (t[index].upper === 'beyond' ||
        t[index].upper !== 'beyond') ? t[index + 1].lower - 1 : "beyond";
    t.splice(index, 1);
    if (matrixRange.length) {
      this.setState({
        matrixRange: t
      });
    }
  };
  handleAddBelowMatrixRange = (index, name) => {
    const { matrixRange } = this.state;
    if (name === 'below') {
      matrixRange.splice((parseInt(index) + 1), 0, {
        margin: "",
        markup: "",
        lower: "",
        upper: ""
      })
    } else {
      matrixRange.splice((parseInt(index) - 1), 1, {
        margin: "",
        markup: "",
        lower: "",
        upper: ""
      })
    }
    this.setState({
      matrixRange
    })
  }

  render() {
    const { matrixRange } = this.state;
    return (
      <>
        <Card>
          <CardHeader>
            <Col sm={'6'} className={'pull-left'}>
              <h4>
                <i className={"fas fa-hand-holding-usd"} /> Price Matrix
              </h4>
            </Col>
          </CardHeader>
        </Card>
        <Row>
          <Col md={"4"}>
            <Card>
              <CardHeader>
                <h4>Matrix List</h4>
              </CardHeader>
              <CardBody>
                Price Matrix Body
                <Col sm={'12'} className={'text-center'}>
                  <Button
                    color='primary'
                    id='add-user'
                    className={"btn btn-round"}
                  >
                    New Matrix
                    </Button>
                  <UncontrolledTooltip target={'add-user'}>
                    New Price Matrix
                  </UncontrolledTooltip>
                </Col>
              </CardBody>
            </Card>
          </Col>
          <Col md={"8"}>
            <Card>
              <CardBody>
                <Row>
                  <Col md={"12"} className={"mb-4"}>
                    <div className={"matrix-input"}>
                      <Input placeholder={"Example Matrix A"} />
                      <div className={"matrix-action"}>
                        <Button className={"btn btn-success"}>Export</Button>
                        <Button className={"btn btn-danger"}><i className="fas fa-trash" /></Button>
                      </div>
                    </div>
                  </Col>
                </Row>
                <table className={"table"}>
                  <thead>
                    <tr>
                      <th>Cost</th>
                      <th className={"text-right"}>Markup</th>
                      <th className={"text-right"}>Margin</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrixRange && matrixRange.length
                      ? matrixRange.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            <tr key={index}>
                              <td className={"justify-content-center"}>
                                <div className={"d-flex align-items-center matrix-input-control"}>
                                  <div className={"d-inline-block"}>
                                    <Input
                                      className={"form-control text-right pr-0"}
                                      name={"costPrice1"}
                                      value={item.lower}
                                      onChange={(e) => this.handleCostChange(index, e)}
                                      disabled={item.lower === '0.00'} />
                                  </div>
                                  <span className={"value-sprate"}><i className="far fa-window-minimize" /></span>
                                  <div className={"d-inline-block"}>
                                    <Input
                                      className={"form-control text-right pr-0"}
                                      onChange={(e) => this.handleCostChange(index, e)}
                                      name={"costPrice2"}
                                      value={item.upper}
                                      placeholder={"$0.00"}
                                      disabled={item.upper === 'beyond'} />
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className={"d-flex justify-content-end matrix-input-control"}>
                                  <Input
                                    className={"form-control text-right pr-0"}
                                    placeholder={"$0.00"} />
                                </div>
                              </td>
                              <td>
                                <div className={"d-flex justify-content-end matrix-input-control"}>
                                  <Input
                                    className={"form-control text-right pr-0"}
                                    placeholder={"$0.00"} />
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
                                        {
                                          index >= 1 ?
                                            <DropdownItem onClick={() => this.handleAddBelowMatrixRange(index, 'above')}>Add range above</DropdownItem> :
                                            null
                                        }
                                        <DropdownItem onClick={() => this.handleAddBelowMatrixRange(index, 'below')}>Add range below</DropdownItem>
                                        {
                                          index >= 1 ?
                                            <DropdownItem>
                                              <span className={"btn btn-danger btn-round"} onClick={() => this.handleRemoveMatrixRange(index)}>
                                                Delete &nbsp; <i className="fas fa-trash" />
                                              </span>
                                            </DropdownItem> :
                                            null
                                        }
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </React.Fragment>  
                        )
                      }) : null}
                  </tbody>
                </table>
                <span
                  onClick={this.handleAddMatrixRange}
                  className="customer-add-phone customer-anchor-text customer-click-btn"
                >
                  Add Range
                </span>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
export default PriceMatrix;
