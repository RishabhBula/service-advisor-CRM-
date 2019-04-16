import React, { Component } from "react";
import {
  Table,
  Badge,
  UncontrolledTooltip,
  Form,
  FormGroup,
  Row,
  Col,
  Label,
  InputGroup,
  Input,
  Button
} from "reactstrap";
import Loader from "../../../containers/Loader/Loader";
import { formateDate } from "../../../helpers/Date";
import PaginationHelper from "../../../helpers/Pagination";
import { withRouter } from "react-router-dom";
import * as qs from "query-string";
import { AppConfig } from "../../../config/AppConfig";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import { CrmCircleBackground } from "../../../components/common/Icon/CrmCircleBackground";
import { toast } from "react-toastify";

class VehiclesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      status: "",
      sort: "",
      user: {},
      openEditModal: false,
      selectedVehicles: []
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort, status } = qs.parse(lSearch);
    this.setState({
      page: parseInt(page) || 1,
      sort: sort || "",
      status: status || "",
      search: search || ""
    });
  }

  componentDidUpdate({ openEdit }) {
    if (this.props.openEdit !== openEdit) {
      this.setState({
        openEditModal: false
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
      param.search = search.trim(" ");
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
      user: {},
      selectedVehicles: []
    });
    this.props.onSearch({});
  };

  editUser = customer => {
    this.props.updateModel(customer);
  };

  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };

  handleCheckboxChnage = e => {
    const { target } = e;
    const { checked, value } = target;
    const { selectedVehicles } = this.state;
    if (checked) {
      selectedVehicles.push(value);
      this.setState({
        selectedVehicles
      });
      return;
    }
    const index = selectedVehicles.indexOf(value);
    selectedVehicles.splice(index, 1);
    this.setState({
      selectedVehicles
    });
  };

  handleCheckAllCheckBox = e => {
    const { target } = e;
    const { checked } = target;
    if (!checked) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    const { vehicleData } = this.props;
    const { vehicleList } = vehicleData;
    const selectedVehicles = [];
    vehicleList.forEach(user => {
      selectedVehicles.push(user._id);
    });
    this.setState({ selectedVehicles });
  };

  handleActionChange = e => {
    const { selectedVehicles } = this.state;
    const { target } = e;
    const { value } = target;
    if (!value) {
      return;
    }
    if (!selectedVehicles.length) {
      toast.error("Please select at least one vehicle.");
      return;
    }
    if (value === "active") {
      this.activateVehicle(true);
    } else if (value === "inactive") {
      this.deactivateVehicle(true);
    } else if (value === "delete") {
      this.onDelete(true);
    }
  };

  onDelete = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to delete selected vehicle(s)?"
        : "Do you want to delete this vehicle?"
    });
    if (!value) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    this.props.onDelete(this.state.selectedVehicles);
  };

  activateVehicle = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to active selected vehicle(s)?"
        : "Do you want to active this vehicle?"
    });
    if (!value) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    this.props.onStatusUpdate({ status: true, vehicles: this.state.selectedVehicles });
  };

  deactivateVehicle = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to inactive selected vehicle(s)?"
        : "Do you want to inactive this vehicle?"
    });
    if (!value) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    this.props.onStatusUpdate({ status: false, vehicles: this.state.selectedVehicles });
  };

  render() {
    const { vehicleData } = this.props;
    const { vehicleList, isLoading, totalVehicles } = vehicleData;
    const { page, search, sort, status, selectedVehicles, user, openEditModal } = this.state;
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
              <Col lg={"3"} md={"3"} className="mb-0">
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
                    <option value={1}>Active</option>
                    <option value={0}>Deactive</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"3"} md={"3"} className="mb-0">
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
              <th width="90px">
                {vehicleList && vehicleList.length ? (
                  <div className="table-checkbox-wrap">
                    <span className="checkboxli checkbox-custom checkbox-default">
                      <Input
                        type="checkbox"
                        name="checkbox"
                        id="checkAll"
                        checked={selectedVehicles.length === vehicleList.length}
                        onChange={this.handleCheckAllCheckBox}
                      />
                      <label className="" htmlFor="checkAll" />
                    </span>
                    <Input
                      className="commonstatus"
                      type="select"
                      id="exampleSelect"
                      onChange={this.handleActionChange}
                    >
                      <option value={""}>Select</option>
                      <option value={"active"}>Active</option>
                      <option value={"inactive"}>Inactive</option>
                      <option value={"delete"}>Delete</option>
                    </Input>
                  </div>
                ) : null}
              </th>
              <th>Type</th>
              <th>Color</th>
              <th>Year</th>
              <th>Make</th>
              <th>Model</th>
              <th>Miles</th>
              <th>Vin</th>
              <th>License Plate</th>
              <th>Unit</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              vehicleList && vehicleList.length ? (
                vehicleList.map((vehicle, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="checkbox-custom checkbox-default coloum-checkbox">
                          <Input
                            type="checkbox"
                            value={vehicle._id}
                            checked={selectedVehicles.indexOf(vehicle._id) > -1}
                            name="checkbox"
                            onChange={this.handleCheckboxChnage}
                          />
                          <label htmlFor={vehicle._id}>
                            {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                          </label>
                        </div>
                      </td>
                      {/* <td>
                        {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}
                      </td> */}
                      <td>{vehicle.type ? vehicle.type.label : ""}</td>
                      <td>
                        {vehicle.color ? (
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <CrmCircleBackground
                              width={"15px"}
                              height={"15px"}
                              backColor={vehicle.color.color}
                            />
                            {vehicle.color.label}
                          </span>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td>{vehicle.year}</td>
                      <td>{vehicle.make}</td>
                      <td>{vehicle.modal}</td>
                      <th>{vehicle.miles}</th>
                      <th>{vehicle.vin}</th>
                      <th>{vehicle.licensePlate}</th>
                      <th>{vehicle.unit}</th>
                      <td>
                        {vehicle.status ? (
                          <Badge
                            className={"badge-button"}
                            color="success"
                            onClick={() => {
                              this.setState(
                                {
                                  selectedVehicles: [vehicle._id]
                                },
                                () => {
                                  this.deactivateVehicle();
                                }
                              );
                            }}
                          >
                            Active
                          </Badge>
                        ) : (
                            <Badge
                              className={"badge-button"}
                              color="danger"
                              onClick={() => {
                                this.setState(
                                  {
                                    selectedVehicles: [vehicle._id]
                                  },
                                  () => {
                                    this.activateVehicle();
                                  }
                                );
                              }}
                            >
                              Inactive
                          </Badge>
                          )}
                      </td>
                      <td>
                        <Button
                          color={"primary"}
                          size={"sm"}
                          onClick={() => this.editUser(vehicle)}
                        >
                          <i className={"fa fa-edit"} />
                        </Button>{" "}
                        &nbsp;
                        <Button
                          color={"danger"}
                          size={"sm"}
                          onClick={() =>
                            this.setState(
                              {
                                selectedVehicles: [vehicle._id]
                              },
                              () => {
                                this.onDelete();
                              }
                            )
                          }
                          id={`delete-${vehicle._id}`}
                        >
                          <i className={"fa fa-trash"} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className={"text-center"} colSpan={10}>
                    No Vehicle records are available
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td className={"text-center"} colSpan={12}>
                  <Loader />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {totalVehicles && !isLoading ? (
          <PaginationHelper
            totalRecords={totalVehicles}
            onPageChanged={page => {
              this.setState({ page });
              this.props.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}
      </>
    );
  }
}

export default withRouter(VehiclesList);
