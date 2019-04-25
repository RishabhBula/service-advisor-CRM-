import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getInventoryPartsList,
  getInventoryPartVendors
} from "../../../actions";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  InputGroup,
  Input,
  UncontrolledTooltip,
  Table
} from "reactstrap";
import { Async } from "react-select";
import { logger } from "../../../helpers/Logger";
import Loader from "../../../containers/Loader/Loader";
class Parts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorId: "",
      search: "",
      status: "",
      sort: ""
    };
  }
  componentDidMount() {
    this.props.getParts();
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  onSearch = e => {
    e.preventDefault();
    logger(this.state);
  };
  loadOptions = (input, callback) => {
    this.props.getInventoryPartsVendors({ input, callback });
  };
  render() {
    const { vendorId, search, status, sort } = this.state;
    const { inventoryPartsData } = this.props;
    const { isLoading, parts } = inventoryPartsData;
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"3"} md={"3"} className="mb-0">
                <FormGroup className="mb-0">
                  <Label className="label">Search</Label>
                  <InputGroup className="mb-2">
                    <input
                      type="text"
                      name="search"
                      onChange={this.handleChange}
                      className="form-control"
                      aria-describedby="searchUser"
                      placeholder="Search by part description and note"
                      value={search}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  <Label htmlFor="exampleSelect" className="label">
                    Filter by
                  </Label>
                  <Input
                    type="select"
                    name="status"
                    id="exampleSelect"
                    onChange={this.handleChange}
                    value={status}
                  >
                    <option className="form-control" value={""}>
                      -- Select --
                    </option>
                    <option value={"critical"}>Critical Quantity</option>
                    <option value={"ncritical"}>Non-Critical Quantity</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  <Label htmlFor="SortFilter" className="label">
                    Sort By
                  </Label>
                  <Input
                    type="select"
                    name="sort"
                    id="SortFilter"
                    onChange={this.handleChange}
                    value={sort}
                  >
                    <option className="form-control" value={""}>
                      -- Select --
                    </option>
                    <option value={"qltoh"}>Quantity(Low to High)</option>
                    <option value={"qhtol"}>Quantity(High to High)</option>
                    <option value={"cltoh"}>Cost(Low to High)</option>
                    <option value={"chtol"}>Cost(High to High)</option>
                    <option value={"rpltoh"}>Retail Price(Low to High)</option>
                    <option value={"rphtol"}>Retail Price(High to High)</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"5"} md={"5"} className="mb-0">
                <Row>
                  <Col md={"6"}>
                    <FormGroup className="mb-0">
                      <Label htmlFor="SortFilter" className="label">
                        Vendor
                      </Label>
                      <Async
                        placeholder={"Type vendor name"}
                        loadOptions={this.loadOptions}
                        value={vendorId}
                        onChange={e => {
                          this.setState({
                            vendorId: e
                          });
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={"6"} md={"6"} className="mb-0">
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
              </Col>
            </Row>
          </Form>
        </div>
        <Table responsive bordered>
          <thead>
            <tr>
              <th width="90px">S.no</th>
              <th>Member Name</th>
              <th>Email</th>
              <th>Rate/hour</th>
              <th className={"text-center"}>Role</th>
              <th>Registered</th>
              <th>Last Login</th>
              <th>Last Login IP</th>
              <th className={"text-center"}>Invitation Status</th>
              <th className={"text-center"}>User Status</th>
              <th className={"text-center"}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className={"text-center"} colSpan={12}>
                  <Loader />
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </>
    );
  }
}
const mapStateToProps = state => ({
  inventoryPartsData: state.inventoryPartsReducers
});
const mapDispatchToProps = dispatch => ({
  getInventoryPartsVendors: data => {
    dispatch(getInventoryPartVendors(data));
  },
  getParts: params => {
    dispatch(getInventoryPartsList(params));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Parts);
