import React, { Component } from "react";
import { Col, Button, UncontrolledTooltip, Label, InputGroup, Table, Form, Row, FormGroup } from "reactstrap";
import { AppConfig } from "../../config/AppConfig";
import * as qs from "query-string";
import { withRouter } from "react-router-dom";
import { logger } from "../../helpers/Logger";

class PriMatrixList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: ""
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search } = qs.parse(lSearch);
    logger(search, "!!!!!!!!!!!!!!!!!!")
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

  render() {
    const { matrixList, handleUpdateMatrix, handleMatrixDelete } = this.props;
    const { page, search } = this.state
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"4"} md={"4"} className="mb-0">
                <FormGroup className="mb-0">
                  <Label className="label">Search</Label>
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
                      <button
                        type="submit"
                        className="btn btn-primary"
                        id="Tooltip-1"
                      >
                        <i className="fa fa-search" />
                      </button>
                      <UncontrolledTooltip target="Tooltip-1">
                        Search
                      </UncontrolledTooltip>
                    </span>
                    <span className="">
                      <button
                        type="button"
                        className="btn btn-danger"
                        id="Tooltip-2"
                        onClick={this.onReset}
                      >
                        <i className="fa fa-refresh" />
                      </button>
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
        <Table responsive bordered>
          <thead>
            <tr>
              <th className={"text-center"}>S No.</th>
              <th>Matrix Name</th>
              <th>Matrix Range</th>
              <th>Creted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              matrixList && matrixList.length ? matrixList.map((matrix, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className='checkbox-custom checkbox-default coloum-checkbox'>
                        {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                      </div>
                    </td>
                    <td>{matrix.matrixName || "-"}</td>
                    <td>
                      {
                        matrix.matrixRange && matrix.matrixRange.length ? matrix.matrixRange.map((range, i) => {
                          return (
                            <React.Fragment key={i}>
                              <span>{range.lower}</span>{"-"}<span>{range.upper}</span> {"  "} <span>{range.margin}</span>
                              <div>{range.markup}</div>
                            </React.Fragment>
                          )
                        }) :
                          null
                      }
                    </td>
                    <td>{matrix.createdAt}</td>
                    <td>
                      <Button
                        color={"primary"}
                        size={"sm"}
                        onClick={() => handleUpdateMatrix(matrix)}
                      >
                        <i className={"fa fa-edit"} />
                      </Button>{" "}
                      &nbsp;
                        <Button
                        color={"danger"}
                        size={"sm"}
                        onClick={() => handleMatrixDelete(matrix._id)
                        }
                      >
                        <i className={"fa fa-trash"} />
                      </Button>
                    </td>
                  </tr>
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
