import React, { Component } from "react";
import { connect } from "react-redux";
import { getInventoryPartsList } from "../../../actions";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  InputGroup,
  Input,
  UncontrolledTooltip,
  Table,
  Badge
} from "reactstrap";
import { Async } from "react-select";
import * as qs from "query-string";
import Loader from "../../../containers/Loader/Loader";
import { AppConfig } from "../../../config/AppConfig";
import PaginationHelper from "../../../helpers/Pagination";
import { logger } from "../../../helpers/Logger";
class Parts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorId: "",
      search: "",
      status: "",
      sort: "",
      filterApplied: false,
      limit: AppConfig.ITEMS_PER_PAGE,
      page: 1
    };
  }
  componentDidMount() {
    const { limit } = this.state;
    let query = {
      limit
    };
    const queryParams = qs.parse(this.props.location.search);
    const { page, search, status, sort, vendorId } = queryParams;
    logger(page);
    this.setState({
      page: page && page > 0 ? parseInt(page) : 1,
      search,
      status,
      sort,
      vendorId: vendorId ? qs.parse(vendorId) : ""
    });
    if (vendorId) {
      query.vendorId = qs.parse(vendorId).value;
    }
    this.props.getParts({ ...queryParams, ...query });
  }
  componentDidUpdate({ location }) {
    const { location: currentLocation } = this.props;
    const { search } = location;
    const { search: currentSearch } = currentLocation;
    if (search !== currentSearch) {
      let query = qs.parse(currentSearch);
      this.setState({ ...query, page: parseInt(query.page) });
      if (query.vendorId) {
        query.vendorId = qs.parse(query.vendorId).value;
      }
      this.props.getParts(query);
    }
  }
  onPageChange = page => {
    const { location } = this.props;
    const { pathname } = location;
    const { search, status, sort, vendorId } = this.state;
    const query = {
      page,
      search,
      status,
      sort,
      vendorId: vendorId ? qs.stringify(vendorId) : undefined
    };
    this.props.redirectTo(`${pathname}?${qs.stringify(query)}`);
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  onSearch = e => {
    e.preventDefault();
    const { location } = this.props;
    const { pathname } = location;
    const { search, status, sort, vendorId } = this.state;
    const query = {
      page: 1,
      search,
      status,
      sort,
      vendorId: vendorId ? qs.stringify(vendorId) : undefined
    };
    this.setState({
      filterApplied: true,
      page: 1
    });
    this.props.redirectTo(`${pathname}?${qs.stringify(query)}`);
  };
  onReset = e => {
    e.preventDefault();
    this.setState({
      filterApplied: false,
      vendorId: "",
      page: 1
    });
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo(`${pathname}`);
  };
  loadOptions = (input, callback) => {
    this.props.getInventoryPartsVendors({ input, callback });
  };
  render() {
    const { vendorId, search, status, sort, filterApplied, page } = this.state;
    const { inventoryPartsData } = this.props;
    const { isLoading, parts, totalParts } = inventoryPartsData;
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
                      placeholder="Search by part description, note, part number and location"
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
                    <option value={"cdltoh"}>Last created</option>
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
                        clearable={true}
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
              <th>Part Description</th>
              <th>Note</th>
              <th>Part number</th>
              <th className={"text-center"}>Vendor</th>
              <th>Bin/Location</th>
              <th>Cost</th>
              <th>Retail Price</th>
              <th className={"text-center"}>Quantity</th>
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
            ) : parts && parts.length ? (
              parts.map((part, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{part.description || "-"}</td>
                    <td>{part.note || "-"}</td>
                    <td>{part.partNumber || "-"}</td>
                    <td>{part.vendorId ? part.vendorId.name || "-" : "-"}</td>
                    <td>{part.location || "-"}</td>
                    <td>{part.cost || "-"}</td>
                    <td>{part.retailPrice || "-"}</td>
                    <td>
                      {part.quantity || 0}&nbsp;
                      {part.quantity <= part.criticalQuantity ? (
                        <Badge color={"warning"}>Reorder</Badge>
                      ) : null}
                    </td>
                    <td>Action</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className={"text-center"} colSpan={12}>
                  {filterApplied ? (
                    <React.Fragment>
                      No Parts found for your search
                    </React.Fragment>
                  ) : (
                    <React.Fragment>No Parts available</React.Fragment>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {totalParts && !isLoading ? (
          <PaginationHelper
            totalRecords={totalParts}
            onPageChanged={page => {
              this.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}
      </>
    );
  }
}
const mapStateToProps = state => ({
  inventoryPartsData: state.inventoryPartsReducers
});
const mapDispatchToProps = dispatch => ({
  getParts: params => {
    dispatch(getInventoryPartsList(params));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Parts);
