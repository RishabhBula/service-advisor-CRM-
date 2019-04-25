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
import { connect } from "react-redux";
import { labourEditRequest,labourListRequest,getRateStandardListRequest,
  setRateStandardListStart, } from "../../../actions";
import {CrmLabourModal }  from '../../common/Labours/CrmLabourModal' 
import PaginationHelper from "../../../helpers/Pagination";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import * as qs from "query-string";
import { withRouter } from "react-router-dom";
import { AppConfig } from "../../../config/AppConfig";
import { toast } from 'react-toastify';

class Labours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFleetModal: false,
      labourListdata: {},
      error: {},
      isLoading: false,
      search: "",
      status: "",
      sort: "",
      type: "",
      page: 1,
      selectedLabours: []
    };
  }

  componentDidMount() {
    this.props.getStdList();
    const query = qs.parse(this.props.location.search);
  
    this.props.getlabour({ ...query, page: query.page || 1 });
  }

  componentDidUpdate({ openEdit }) {
    // if (this.props.openEdit !== openEdit) {
    //   this.setState({
    //     openFleetModal: false
    //   });
    // }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleCheckAllCheckBox = e => {
    // const { labourListData } = this.props;
    // const { labourData } = labourListData;
    // const { data } = labourData
    // const { target } = e;
    // const { checked } = target;
    // if (!checked) {
    //   this.setState({
    //     selectedLabours: [],
    //   });
    //   return;
    // }
    // const selectedLabours = [];
    // data.forEach(data => {
    //   selectedLabours.push(data._id);
    // });
    // this.setState({ selectedLabours });
  };

  handleCheckboxChange = e => {
    // const { target } = e;
    // const { checked, value } = target;
    // const { selectedLabours } = this.state;
    // if (checked) {
    //   selectedLabours.push(value);
    //   this.setState({
    //     selectedLabours,
    //   });
    //   return;
    // }
    // const index = selectedLabours.indexOf(value);
    // selectedLabours.splice(index, 1);
    // this.setState({
    //   selectedLabours,
    // });
  };

  handleActionChange = e => {
    // const { selectedLabours } = this.state;
    // const { target } = e;
    // const { value } = target;
    // if (!value) {
    //   return;
    // }
    // if (!selectedLabours.length) {
    //   toast.error('Please select at least one customer.');
    //   return;
    // }
    // if (value === 'active') {
    //   this.activateUsers(true);
    // } else if (value === 'inactive') {
    //   this.deactivateUsers(true);
    // } else if (value === 'delete') {
    //   this.onDelete(true);
    // }
  };
  activateUsers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? 'Do you want to active selected fleet(s)?'
        : 'Do you want to active this fleet?',
    });
    if (!value) {
      this.setState({
        selectedLabours: [],
      });
      return;
    }
    this.props.onStatusUpdate({ status: true, labourId: this.state.selectedLabours });
    this.setState({ selectedLabours: [] });
  };

  deactivateUsers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? 'Do you want to inactive selected fleet(s)?'
        : 'Do you want to inactive this fleet?',
    });
    if (!value) {
      this.setState({
        selectedLabours: [],
      });
      return;
    }
    this.props.onStatusUpdate({ status: false, labourId: this.state.selectedLabours });
    this.setState({ selectedLabours: [] });

  };

  onSearch = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      selectedLabours: []
    });
    const { search, sort, status } = this.state;
    let param = {};
    param.page = 1;
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
      user: {}
    });
    this.props.onSearch({});
  };

  updateLabour =  data =>{
    console.log(data);
  }

  onUpdate = (id, data) => {
    //this.props.onUpdate(id, data);
  };

  onDelete = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to delete selected fleet(s)?"
        : "Do you want to delete this fleet?"
    });
    if (!value) {
      this.setState({
        selectedLabours: []
      });
      return;
    }
    this.props.onDelete(this.state.selectedLabours);
    this.setState({ selectedLabours: [] });
  };
  onTypeHeadStdFun = data => {
    this.props.getStdList(data); 
  };
  setDefaultRate = value => {
    this.props.setLabourRateDefault(value);
  };

  onPageChange = (page) => {
    this.setState({page});
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join("?")
    );
  }

  render() {
    const {
      search,
      status,
      sort,
      page,
      selectedLabours } = this.state
    const { labourReducer,profileInfoReducer,rateStandardListReducer,modelInfoReducer, modelOperate } = this.props;
    console.log('=======================');
    // const { modelDetails } = modelInfoReducer;
    // const { typeAddModalOpen } = modelDetails;
    const { isLoading, labourData } = labourReducer;
    console.log(labourData);
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
                      placeholder="Search by company name and email"
                    />
                  </InputGroup>
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
                      -- Select --
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
              <th width='90px'>S.No.           
              </th>
              <th>Labour Description</th>
              <th>Note</th>
              <th>Rate</th>
              <th>Hours</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              labourData && labourData.data && labourData.data.length ? (
                labourData.data.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <label htmlFor={data._id}>
                            {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                        </label>
                      </td>
                      <td>{data.discription || "-"}</td>
                      <td>{data.notes || "-"}</td>
                      <td>{data.rate.name || "-"}</td>
                      <td>{data.hours || "-"}</td>
                      <td>{'$'+data.rate.hourlyRate || "-"}</td>
                      <td>{data.discount || "-"}</td>
                    
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
                          onClick={() =>
                            this.setState(
                              {
                                selectedLabours: [data._id]
                              },
                              () => {
                                this.onDelete();
                              })
                          }
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
                      No labour are available
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

        {labourData.totalLabour && !isLoading ? (
          <PaginationHelper
            totalRecords={labourData.totalLabour}
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
  profileInfoReducer: state.profileInfoReducer,
  labourReducer: state.labourReducer,
});

const mapDispatchToProps = dispatch => ({
  // updateFleet: (data) => {
  //   dispatch(labourEditRequest(data))
  // }
  getStdList: () => {
    dispatch(getRateStandardListRequest());
  },
  getlabour: data => {
    dispatch(labourListRequest(data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Labours));
