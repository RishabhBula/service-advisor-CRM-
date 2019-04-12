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
import Loader from "../../containers/Loader/Loader";
import { formateDate } from "../../helpers/Date";
import PaginationHelper from "../../helpers/Pagination";
import { withRouter } from "react-router-dom";
import * as qs from "query-string";
import { AppConfig } from "../../config/AppConfig";
import { ConfirmBox } from "../../helpers/SweetAlert";
import { CrmUserModal } from "../common/CrmUserModal";
import { RoleOptions } from "../../config/Constants";
import { toast } from "react-toastify";
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      status: "",
      invitaionStatus: "",
      sort: "",
      type: "",
      user: {},
      openEditModal: false,
      selectedUsers: []
    };
  }
  componentDidMount() {
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort, status, type, invitaionStatus } = qs.parse(
      lSearch
    );
    this.setState({
      page: page > 1 ? parseInt(page) : 1,
      sort: sort || "",
      status: status || "",
      search: search || "",
      type: type || "",
      invitaionStatus: invitaionStatus || ""
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
    this.setState({
      page: 1,
      selectedUsers: []
    });
    const { search, sort, status, type, invitaionStatus } = this.state;
    let param = {};
    param.page = 1;
    if (search) {
      param.search = search;
    }
    if (sort) {
      param.sort = sort;
    }
    if (status) {
      param.status = status;
    }
    if (type) {
      param.type = type;
    }
    if (invitaionStatus) {
      param.invitaionStatus = invitaionStatus;
    }
    this.props.onSearch(param);
  };
  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
      status: "",
      invitaionStatus: "",
      sort: "",
      type: "",
      user: {},
      selectedUsers: []
    });
    this.props.onSearch({});
  };
  onDelete = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to delete selected user(s)?"
        : "Do you want to delete this user?"
    });
    if (!value) {
      this.setState({
        selectedUsers: []
      });
      return;
    }
    this.props.onDelete(this.state.selectedUsers);
  };
  editUser = user => {
    this.setState({ openEditModal: true, user });
  };
  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };
  handleCheckboxChnage = e => {
    const { target } = e;
    const { checked, value } = target;
    const { selectedUsers } = this.state;
    if (checked) {
      selectedUsers.push(value);
      this.setState({
        selectedUsers
      });
      return;
    }
    const index = selectedUsers.indexOf(value);
    selectedUsers.splice(index, 1);
    this.setState({
      selectedUsers
    });
  };
  handleCheckAllCheckBox = e => {
    const { target } = e;
    const { checked } = target;
    if (!checked) {
      this.setState({
        selectedUsers: []
      });
      return;
    }
    const { userData } = this.props;
    const { users } = userData;
    const selectedUsers = [];
    users.forEach(user => {
      selectedUsers.push(user._id);
    });
    this.setState({ selectedUsers });
  };
  activateUsers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to active selected user(s)?"
        : "Do you want to active this user?"
    });
    if (!value) {
      this.setState({
        selectedUsers: []
      });
      return;
    }
    this.props.onStatusUpdate({ status: 1, users: this.state.selectedUsers });
  };
  deactivateUsers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to inactive selected user(s)?"
        : "Do you want to inactive this user?"
    });
    if (!value) {
      this.setState({
        selectedUsers: []
      });
      return;
    }
    this.props.onStatusUpdate({ status: 0, users: this.state.selectedUsers });
  };
  handleActionChange = e => {
    const { selectedUsers } = this.state;
    const { target } = e;
    const { value } = target;
    if (!value) {
      return;
    }
    if (!selectedUsers.length) {
      toast.error("Please select at least one user.");
      return;
    }
    if (value === "active") {
      this.activateUsers(true);
    } else if (value === "inactive") {
      this.deactivateUsers(true);
    } else if (value === "delete") {
      this.onDelete(true);
    }
  };
  render() {
    const { userData } = this.props;
    const { users, isLoading, totalUsers } = userData;
    const {
      page,
      search,
      sort,
      status,
      invitaionStatus,
      type,
      user,
      openEditModal,
      selectedUsers
    } = this.state;
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
                      value={search}
                      aria-describedby="searchUser"
                      placeholder="Search by first name, last name and email"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  <Label htmlFor="exampleSelect" className="label">
                    Invitation Status
                  </Label>
                  <Input
                    type="select"
                    name="invitaionStatus"
                    id="exampleSelect"
                    onChange={this.handleChange}
                    value={invitaionStatus}
                  >
                    <option className="form-control" value={""}>
                      -- Select --
                    </option>
                    <option value={1}>Accepted</option>
                    <option value={0}>Pending</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  <Label htmlFor="exampleSelect" className="label">
                    User Status
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
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
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
                    <option value={"createddesc"}>Last Created</option>
                    <option value={"loginasc"}>Last login</option>
                    <option value={"nasc"}>Name A-Z</option>
                    <option value={"ndesc"}>Name Z-A</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"3"} md={"3"} className="mb-0">
                <Row>
                  <Col md={"6"}>
                    <FormGroup className="mb-0">
                      <Label htmlFor="SortFilter" className="label">
                        User Type
                      </Label>
                      <Input
                        type="select"
                        name="type"
                        id="SortFilter"
                        onChange={this.handleChange}
                        value={type}
                      >
                        <option className="form-control" value={""}>
                          -- Select --
                        </option>
                        {RoleOptions.map((role, index) => {
                          return (
                            <option value={role.key} key={index}>
                              {role.text}
                            </option>
                          );
                        })}
                      </Input>
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
              <th width="90px">
                {users.length ? (
                  <div className="table-checkbox-wrap">
                    <span className="checkboxli checkbox-custom checkbox-default">
                      <Input
                        type="checkbox"
                        name="checkbox"
                        id="checkAll"
                        checked={selectedUsers.length === users.length}
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
              <th>Member Name</th>
              <th>Email</th>
              <th>Rate/hour</th>
              <th>Role</th>
              <th>Registered</th>
              <th>Last Login</th>
              <th>Last Login IP</th>
              <th>Invitation Status</th>
              <th>User Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              users.length ? (
                users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="checkbox-custom checkbox-default coloum-checkbox">
                          <Input
                            type="checkbox"
                            value={user._id}
                            checked={selectedUsers.indexOf(user._id) > -1}
                            name="checkbox"
                            onChange={this.handleCheckboxChnage}
                          />
                          <label htmlFor={user._id}>
                            {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                          </label>
                        </div>
                      </td>
                      <td>
                        {[user.firstName, user.lastName].join(" ").trim()}
                      </td>
                      <td>{user.email || "-"}</td>
                      <td>
                        {user.rate ? ["$", user.rate.toFixed(2)].join("") : "-"}
                      </td>
                      <td>{user.roleType ? user.roleType.userType : "-"}</td>
                      <td>
                        {user.createdAt ? formateDate(user.createdAt) : "-"}
                      </td>
                      <td>
                        {user.loggedInAt ? formateDate(user.loggedInAt) : "-"}
                      </td>
                      <td>{user.loggedInIp || "-"}</td>
                      <td>
                        {user.userSideActivation ? (
                          <Badge color="success">Accepted</Badge>
                        ) : (
                          <Badge color="warning">Pending</Badge>
                        )}
                      </td>
                      <td>
                        {user.status ? (
                          <Badge
                            className={"badge-button"}
                            color="success"
                            onClick={() => {
                              this.setState(
                                {
                                  selectedUsers: [user._id]
                                },
                                () => {
                                  this.activateUsers();
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
                                  selectedUsers: [user._id]
                                },
                                () => {
                                  this.deactivateUsers();
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
                          onClick={() => this.editUser(user)}
                          id={`edit-${user._id}`}
                        >
                          <i className={"fa fa-edit"} />
                        </Button>{" "}
                        <UncontrolledTooltip target={`edit-${user._id}`}>
                          Edit details of {user.firstName}
                        </UncontrolledTooltip>
                        &nbsp;
                        <Button
                          color={"danger"}
                          size={"sm"}
                          onClick={() =>
                            this.setState(
                              {
                                selectedUsers: [user._id]
                              },
                              () => {
                                this.onDelete();
                              }
                            )
                          }
                          id={`delete-${user._id}`}
                        >
                          <i className={"fa fa-trash"} />
                        </Button>
                        <UncontrolledTooltip target={`delete-${user._id}`}>
                          Delete {user.firstName}
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className={"text-center"} colSpan={12}>
                    No staff member available
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
        {totalUsers && !isLoading ? (
          <PaginationHelper
            totalRecords={totalUsers}
            onPageChanged={page => {
              this.setState({ page });
              this.props.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}

        <CrmUserModal
          userModalOpen={openEditModal}
          handleUserModal={() => {
            this.setState({
              openEditModal: false,
              user: {}
            });
          }}
          userData={user}
          updateUser={this.onUpdate}
        />
      </>
    );
  }
}

export default withRouter(UserList);
