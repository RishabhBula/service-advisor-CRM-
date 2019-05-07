import React, { Component } from "react";
import { Col, Button, UncontrolledTooltip, Label, InputGroup, Table, Form, Row, FormGroup } from "reactstrap";
import { AppConfig } from "../../config/AppConfig";
import * as qs from "query-string";
import { withRouter } from "react-router-dom";

class PriMatrixList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      isTireSizeOpen: -1,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search } = qs.parse(lSearch);
    this.setState({
      page: parseInt(page) || 1,
      search: search || "",
    });
  }

  componentDidUpdate = ({ matrixList }) => {
    if (matrixList !== this.props.matrixList) {
      const { location } = this.props;
      const lSearch = location.search;
      const { page, search } = qs.parse(lSearch);
      this.setState({
        page: parseInt(page) || 1,
        search: search || "",
      });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSearch = e => {
    e.preventDefault();
    this.setState({
      page: 1,
    });
    const { search } = this.state;
    let param = {};
    param.page = 1;
    if (search) {
      param.search = search.trim(" ");
    }
    this.props.onSearch(param);
  };

  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
    });
    this.props.onSearch({});
  };

  handleSize =  (id, index) => {
    this.setState({
      toggle: !this.state.toggle,
      isTireSizeOpen: this.state.isTireSizeOpen === index ? -1 : index,
      tireSizeid: id
    })

  }

  render() {
    const { matrixList, handleUpdateMatrix, handleMatrixDelete } = this.props;
    const { page, search, isTireSizeOpen } = this.state
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"4"} md={"4"} className="mb-0">
                <FormGroup className="mb-0">
                  <InputGroup className="mb-2">
                    <input
                      type="text"
                      name="search"
                      onChange={this.handleChange}
                      value={search}
                      className="form-control"
                      aria-describedby="searchUser"
                      placeholder="Search by matrix name"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <div className="filter-btn-wrap">
                  <Label className="height17 label" />
                  <div className="form-group mb-0">
                    <span className="mr-2">
                      <Button
                        type="submit"
                        className="btn btn-secondary btn-theme-transparent"
                        id="Tooltip-1"
                      >
                        <i className="icons cui-magnifying-glass" />
                      </Button>
                      <UncontrolledTooltip target="Tooltip-1">
                        Search
                      </UncontrolledTooltip>
                    </span>
                    <span className="">
                      <Button
                        type="button"
                        className="btn btn-secondary btn-theme-transparent"
                        id="Tooltip-2"
                        onClick={this.onReset}
                      >
                        <i className="icon-refresh icons" />
                      </Button>
                      <UncontrolledTooltip target={"Tooltip-2"}>
                        Reset all filters
                      </UncontrolledTooltip>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Table responsive className={"price-matrix-table"}>
          <thead>
            <tr>
              <th width="60" class="text-center">S No.</th>
              <th>Matrix Name</th>
              <th>Matrix Range</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              matrixList && matrixList.length ? matrixList.map((matrix, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td>
                        <div className='checkbox-custom checkbox-default coloum-checkbox'>
                          {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                      </div>
                      </td>
                      <td>{matrix.matrixName || "-"}</td>
                      <td>
                        {matrix.matrixRange && matrix.matrixRange.length ?
                          <Button
                            size={"sm"}
                            className={"btn-square btn-light second"}
                            onClick={() => this.handleSize(matrix._id, index)}
                          >
                            <b>Size Details</b>
                            {isTireSizeOpen === index ? <i class="icons icon-arrow-up ml-2"></i> : <i class="icons icon-arrow-down ml-2"></i>}
                          </Button> : null
                        }
                      </td>
                      <td>{matrix.createdAt}</td>
                      <td>
                        <span className="mr-2">
                          <Button
                            color={"secondary"}
                            size={"sm"}
                            onClick={() => handleUpdateMatrix(matrix)}
                            className={"btn-theme-transparent"}
                            id={`Tooltip-1${matrix._id}`}
                          >
                            <i className={"icons cui-pencil"} />
                          </Button>
                          <UncontrolledTooltip target={`Tooltip-1${matrix._id}`}>
                            Edit
                      </UncontrolledTooltip>
                        </span>
                        <Button
                          color={"secondary"}
                          size={"sm"}
                          className={"btn-theme-transparent"}
                          onClick={() => handleMatrixDelete(matrix._id)
                          }
                          id={`Tooltip-${matrix._id}`}
                        >
                          <i className={"icons cui-trash"} />
                        </Button>
                        <UncontrolledTooltip target={`Tooltip-${matrix._id}`}>
                          Delete
                      </UncontrolledTooltip>
                      </td>
                    </tr>
                    {matrix.matrixRange && matrix.matrixRange.length ? 
                    <tr className={isTireSizeOpen === index ? 'active' : 'inactive'}>
                      <td colSpan={"6"} className={"p-0"}>
  
                          <Table>
                            <thead>
                              <tr>
                                <th width="60" class="text-center"></th>
                                <th width={"200"}>Cost Range</th>
                                <th width={"200"}>Margin</th>
                                <th width={"200"}>Markup</th>
                                <th width="400" class="text-center"></th>
                              </tr>
                            </thead>
                            <tbody>
                              
                            {
                              matrix.matrixRange && matrix.matrixRange.length ? matrix.matrixRange.map((range, i) => {
                                return (
                                  <tr key={i}>
                                    <td></td>
                                    <td>{range.lower} - {range.upper}</td>
                                    <td>{range.margin}</td>
                                    <td>{range.markup}</td>
                                    <td></td>
                                  </tr>
                                )
                              }) :
                                null
                            }
                              
                            </tbody>
                          </Table>
                      </td>
                    </tr>
                    : null }
                  </>
                )
              }) :
                null
            }
          </tbody>
        </Table>
      </>
    );
  }
}

export default withRouter(PriMatrixList);
