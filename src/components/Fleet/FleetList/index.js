import React, { Component } from "react";
import {
  Table,
  Badge,
  Button,
  Form,
  FormGroup,
  Row,
  Col,
  Label,
  InputGroup,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import Loader from "../../../containers/Loader/Loader";
import { CrmFleetModal } from '../../common/CrmFleetModal'
import { connect } from "react-redux";
import { fleetEditRequest } from "../../../actions";
import { logger } from "../../../helpers/Logger";
import Validator from "js-object-validation";
import { CreateFleetValidations, CreateFleetValidMessaages } from "../../../validations";
import PaginationHelper from "../../../helpers/Pagination";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import * as qs from "query-string";
import { withRouter } from "react-router-dom";
import { AppConfig } from "../../../config/AppConfig";
class FleetList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFleetModal: false,
      fleetListdata: {},
      error: {},
      isLoading: false,
      search: "",
      status: "",
      sort: "",
      type: "",
      page: 1,
    };
  }
  componentDidMount() {
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort, status, type } = qs.parse(lSearch);
    this.setState({
      page: parseInt(page) || 1,
      sort: sort || "",
      status: status || "",
      search: search || "",
      type: type || ""
    });
  }
  componentDidUpdate({ openEdit }) {
    if (this.props.openEdit !== openEdit) {
      this.setState({
        openFleetModal: false
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
    const { page, search, sort, status } = this.state;
    let param = {};
    if (page && page > 1) {
      param.page = page;
    }
    if (search) {
      param.search = search;
    }
    if (sort) {
      param.sort = sort;
    }
    if (status) {
      param.status = status;
    }
    this.props.onSearch(param);
  };
  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
      status: "",
      sort: "",
      user: {}
    });
    this.props.onSearch({});
  };
  handleAddFleet = (fleetData, isEditMode, fleetId) => {
    this.setState({
      error: {}
    });
    try {
      const { isValid, errors } = Validator(
        fleetData,
        CreateFleetValidations,
        CreateFleetValidMessaages
      );
      if (!isValid && ((fleetData.email !== '') || (fleetData.companyName === ''))) {
        this.setState({
          error: errors,
          isLoading: false,
        });
        return;
      }
      const userData = this.props.profileInfoReducer.profileInfo
      const userId = userData._id
      const parentId = userData.parentId
      const data = {
        fleetData: fleetData,
        userId: userId,
        parentId: parentId,
        fleetId: fleetId
      }
      if (isEditMode) {
        this.props.updateFleet(data)
        this.setState({
          openCreate: !this.state.openCreate
        })
      }
    } catch (error) {
      logger(error);
    }
  }
  editFleet = fleetData => {
    this.setState({
      openFleetModal: true,
      fleetListdata: fleetData
    });
  };
  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };
  onDelete = async fleetId => {
    const { value } = await ConfirmBox({
      text: "Do you want to delete this fleet?"
    });
    if (!value) {
      return;
    }
    this.props.onDelete(fleetId);
  };
  render() {
    const {
      openFleetModal,
      fleetListdata,
      error,
      search,
      status,
      sort,
      page, } = this.state
    const { fleetListData } = this.props;
    const { isLoading, fleetData } = fleetListData;
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
                      className="form-control"
                      value={search}
                      aria-describedby="searchUser"
                      placeholder="Search by first name, last name and email"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  <Label for="exampleSelect" className="label">
                    Status
                  </Label>
                  <Input
                    type="select"
                    name="status"
                    id="exampleSelect"
                    onChange={this.handleChange}
                    value={status}
                  >
                    <option className="form-control" value={""}>
                      -- Select Status --
                    </option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  <Label for="SortFilter" className="label">
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
                      -- Select Status --
                    </option>
                    <option value={"createddesc"}>Last Created</option>
                    <option value={"nasc"}>Name A-Z</option>
                    <option value={"ndesc"}>Name Z-A</option>
                  </Input>
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
              <th>Company Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Vehicles</th>
              <th>Orders</th>
              <th>Lables</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              fleetData.length || fleetData.data ? (
                fleetData.data.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{data.companyName || "-"}</td>
                      <td>{data.phoneDetail ?
                        data.phoneDetail.map((data, index) => {
                          return (
                            <div>{index + 1}.
                            {" "}{data.phone || "NA"}{"|"}{"  "}{data.value || "NA"}</div>
                          )
                        }) : "-"}</td>
                      <td>{data.email || "-"}</td>
                      <td>0</td>
                      <td>0</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-primary btn-round"><i className="fas fa-plus-square" /></button>
                      </td>
                      <td>
                        {data.status ? (
                          <Badge color="success">Active</Badge>
                        ) : (
                            <Badge color="danger">Inactive</Badge>
                          )}
                      </td>
                      <td>
                        <Button
                          color={"primary"}
                          size={"sm"}
                          onClick={() => this.editFleet(data)}
                        >
                          <i className={"fa fa-edit"} />
                        </Button>{" "}
                        &nbsp;
                        <Button
                          color={"danger"}
                          size={"sm"}
                          onClick={() => this.onDelete(data._id)}
                        >
                          <i className={"fa fa-trash"} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={8}>
                      No Fleet Found
                  </td>
                  </tr>
                )
            ) : (
                <tr>
                  <td className={"text-center"} colSpan={10}>
                    <Loader />
                  </td>
                </tr>
              )
            }
          </tbody>
        </Table>
        {fleetData.totalfleet && !isLoading ? (
          <PaginationHelper
            totalRecords={fleetData.totalfleet}
            onPageChanged={page => {
              this.setState({ page });
              this.props.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}
        <CrmFleetModal
          fleetModalOpen={openFleetModal}
          handleFleetModal={() => {
            this.setState({
              openFleetModal: false,
              fleetData: {}
            });
          }}
          fleetData={fleetListdata}
          handleAddFleet={this.handleAddFleet}
          errorMessage={error}
          updateFleet={this.onUpdate}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
});

const mapDispatchToProps = dispatch => ({
  updateFleet: (data) => {
    dispatch(fleetEditRequest(data))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FleetList));
