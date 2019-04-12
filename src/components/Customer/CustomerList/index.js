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
import { CrmUserModal } from "../../common/CrmUserModal";
class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      status: "",
      sort: "",
      user: {},
      openEditModal: false
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
      param.search = search.trim();
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
  onDelete = async userId => {
    const { value } = await ConfirmBox({
      text: "Do you want to delete this customer?"
    });
    if (!value) {
      return;
    }
    this.props.onDelete(userId);
  };
  editUser = customer => {
    this.props.updateModel(customer)
  };
  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };
  render() {
    const { customerData } = this.props;
    const { customers, isLoading, totalCustomers } = customerData;
    const { page, search, sort, status, user, openEditModal } = this.state;
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
              <th>SNO</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              customers && customers.length ? (
                customers.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>{(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}</td>
                      <td>{user.firstName || "-"}</td>
                      <td>{user.lastName || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td>
                        {user.createdAt ? formateDate(user.createdAt) : "-"}
                      </td>
                    
                      <td>
                        {user.status ? (
                          <Badge color="success">Active</Badge>
                        ) : (
                          <Badge color="danger">Inactive</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          color={"primary"}
                          size={"sm"}
                          onClick={() => this.editUser(user)}
                        >
                          <i className={"fa fa-edit"} />
                        </Button>{" "}
                        &nbsp;
                        <Button
                          color={"danger"}
                          size={"sm"}
                          onClick={() => this.onDelete(user._id)}
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
                    No customer records are available
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td className={"text-center"} colSpan={10}>
                  <Loader />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {totalCustomers && !isLoading ? (          
          <PaginationHelper
            totalRecords={totalCustomers}
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

export default withRouter(CustomerList);
