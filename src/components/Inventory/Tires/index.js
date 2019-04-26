import React, { Component } from "react";
import {
  getTiersList, updateTierStatus, deleteTier, editTier,
  getInventoryPartVendors
} from '../../../actions'
import { connect } from "react-redux";
import * as qs from "query-string";
import { isEqual } from "../../../helpers/Object";
import {
  Table,
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
import { AppConfig } from "../../../config/AppConfig";
import Loader from "../../../containers/Loader/Loader";
import PaginationHelper from "../../../helpers/Pagination";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import { toast } from "react-toastify";
import { CrmTyreModal } from "../../common/Tires/CrmTyreModal"
class Tires extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      status: "",
      invitaionStatus: "",
      sort: "",
      type: "",
      tire: {},
      openEditModal: false,
      selectedTires: [],
      filterApplied: false,
      bulkAction: ""
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const query = qs.parse(location.search);
    const lSearch = location.search;
    const { page, search, sort } = qs.parse(lSearch);
    this.props.getTires({ ...query, page: query.page || 1 });
    this.setState({
      page: parseInt(page) || 1,
      sort: sort || "",
      search: search || ""
    })
  }

  componentDidUpdate({ tireReducer, location }) {
    if (
      this.props.tireReducer.tireData.isSuccess !==
      tireReducer.tireData.isSuccess
    ) {
      if (this.props.tireReducer.tireData.isSuccess) {
        const query = qs.parse(this.props.location.search);
        this.props.getTires({ ...query, page: query.page || 1 });
      }
    }
    if (
      this.props.tireReducer.tireData.isEditSuccess !==
      tireReducer.tireData.isEditSuccess
    ) {
      if (this.props.tireReducer.tireData.isEditSuccess) {
        const query = qs.parse(this.props.location.search);
        this.props.getTires({ ...query, page: query.page || 1 });
      }
    }
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      this.props.getTires({ ...currQuery, page: currQuery.page || 1 });
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
      selectedTires: []
    });
    const { search, sort } = this.state;
    let param = {};
    param.page = 1;
    let hasFilter = false;
    if (search) {
      param.search = search;
      hasFilter = true;
    }
    if (sort) {
      param.sort = sort;
    }
    this.setState({ filterApplied: hasFilter });
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(param)].join("?"))
  };

  onReset = e => {
    e.preventDefault();
    this.onSearch(e);
    this.setState({
      page: 1,
      search: "",
      status: "",
      sort: "",
      type: "",
      tire: {},
      selectedTires: [],
      filterApplied: false
    });
  };

  onDelete = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to delete selected tier(s)?"
        : "Do you want to delete this tier?"
    });
    if (!value) {
      this.setState({
        selectedTires: []
      });
      return;
    }
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    const data = {
      ...query,
      tireId: this.state.selectedTires,
    };
    this.props.deleteTire(data);
    this.setState({ selectedTires: [] });
  };

  editTire = tier => {
    this.setState({ tire: tier }, () => {
      this.props.modelOperate({
        tireEditModalOpen: true
      });
    });
  };

  onUpdate = (id, data) => {
    this.props.updateTire(id, data);
  };

  handleCheckboxChnage = e => {
    const { target } = e;
    const { checked, value } = target;
    const { selectedTires } = this.state;
    if (checked) {
      selectedTires.push(value);
      this.setState({
        selectedTires
      });
      return;
    }
    const index = selectedTires.indexOf(value);
    selectedTires.splice(index, 1);
    this.setState({
      selectedTires
    });
  };

  handleCheckAllCheckBox = e => {
    const { target } = e;
    const { checked } = target;
    if (!checked) {
      this.setState({
        selectedTires: [],
        bulkAction: ""
      });
      return;
    }
    const { tireReducer } = this.props;
    const { tires } = tireReducer;
    const selectedTires = [];
    tires.forEach(tire => {
      selectedTires.push(tire._id);
    });
    this.setState({ selectedTires });
  };

  handleActionChange = e => {
    const { selectedTires } = this.state;
    const { target } = e;
    const { value } = target;
    this.setState({
      bulkAction: value
    });
    if (!value) {
      return;
    }
    if (!selectedTires.length) {
      toast.error("Please select at least one tire.");
      return;
    }
    if (value === "active") {
      this.activateTires(true);
    } else if (value === "inactive") {
      this.deactivateTires(true);
    } else if (value === "delete") {
      this.onDelete(true);
    }
  };

  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join('?')
    );
  };

  render() {
    const { tireReducer, modelInfoReducer, modelOperate } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { tireEditModalOpen } = modelDetails;
    const { tires, isLoading, totalTires } = tireReducer;
    const {
      page,
      search,
      sort,
      selectedTires,
      tire
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
                      placeholder="Search by brand, modal and seasonality"
                    />
                  </InputGroup>
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
                    <option value={"nasc"}>Name A-Z</option>
                    <option value={"ndesc"}>Name Z-A</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"3"} md={"3"} className="mb-0">
                <Row>
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
        <Table responsive bordered className={"tire-table"}>
          <thead>
            <tr>
              <th width="90px">
                <div className="table-checkbox-wrap">
                  {tires && tires.length ?
                    <span className='checkboxli checkbox-custom checkbox-default' >
                      <Input
                        type='checkbox'
                        name='checkbox'
                        id='checkAll'
                        checked={tires && tires.length ? selectedTires.length === tires.length : null}
                        onChange={this.handleCheckAllCheckBox}
                      />
                      <label className='' htmlFor='checkAll'></label>
                    </span> :
                    <span className='checkboxli checkbox-custom checkbox-default' >
                      <label></label>
                    </span>
                  }
                  {tires && tires.length ? (
                    <Input
                      className='commonstatus'
                      type='select'
                      id='exampleSelect'
                      onChange={this.handleActionChange}
                    >
                      <option value={''}>Select</option>
                      <option value={'delete'}>Delete</option>
                    </Input>
                  ) :
                    <Input
                      className='commonstatus'
                      type='select'
                      id='exampleSelect'
                      disabled
                      onChange={this.handleActionChange}
                    >
                      <option value={''}>Select</option>
                      <option value={'delete'}>Delete</option>
                    </Input>}
                </div>
              </th>
              <th>Brand Name</th>
              <th>Modal Name</th>
              <th className={"tire-size-th"} width={"100"}>Size</th>
              <th className={"tire-th"} width={"70"}>Part Number</th>
              <th className={"tire-th"} width={"70"}>Cost</th>
              <th className={"tire-th"} width={"70"}>Retails Price</th>
              <th className={"tire-th"} width={"70"}>Quatity</th>
              <th className={"tire-bin-th"} width={"70"}>BIN/Location</th>
              <th>Vendor</th>
              <th>Seasonality</th>
              {/* <th className={"text-center"}>Tire Status</th> */}
              <th className={"text-center action-td"}>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              tires.length ? (
                tires.map((tire, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="checkbox-custom checkbox-default coloum-checkbox">
                          <Input
                            type="checkbox"
                            value={tire._id}
                            checked={selectedTires.indexOf(tire._id) > -1}
                            name="checkbox"
                            onChange={this.handleCheckboxChnage}
                          />
                          <label htmlFor={tire._id}>
                            {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                          </label>
                        </div>
                      </td>
                      <td>
                        {tire.brandName || "-"}
                      </td>
                      <td>{tire.modalName || "-"}</td>
                      <td colSpan={"6"}>
                        <table className={"table tire-size-table justify-content-center"}>
                          {tire.tierSize && tire.tierSize.length ? tire.tierSize.map((size, index) => {
                            return (
                              <tr key={index}>
                                <td width={"100"}>{size.baseInfo.replace("_ __" || "_" || "__", "") || "-"}</td>
                                <td width={"70"}>{size.part || "-"}</td>
                                <td width={"70"}>{size.cost || "$0.00"}</td>
                                <td width={"70"}>{size.retailPrice || "$0.00"}</td>
                                <td width={"70"}>{size.quantity || "-"}</td>
                                <td width={"70"}>{size.bin || "-"}</td>
                              </tr>
                            )
                          }) :
                            " No tire size added"
                          }
                        </table>
                      </td>
                      <td>{tire.vendorId && tire.vendorId.name ? tire.vendorId.name : "-"}</td>
                      <td className={"season-td"}>
                        {tire.seasonality || "-"}
                      </td>
                      <td className={"text-center action-td"}>
                        <Button
                          color={"primary"}
                          size={"sm"}
                          onClick={() => this.editTire(tire)}
                          id={`edit-${tire._id}`}
                        >
                          <i className={"fa fa-edit"} />
                        </Button>{" "}
                        <UncontrolledTooltip target={`edit-${tire._id}`}>
                          Edit details of {tire.brandName}
                        </UncontrolledTooltip>
                        &nbsp;
                        <Button
                          color={"danger"}
                          size={"sm"}
                          onClick={() =>
                            this.setState(
                              {
                                selectedTires: [tire._id]
                              },
                              () => {
                                this.onDelete();
                              }
                            )
                          }
                          id={`delete-${tire._id}`}
                        >
                          <i className={"fa fa-trash"} />
                        </Button>
                        <UncontrolledTooltip target={`delete-${tire._id}`}>
                          Delete {tire.brandName}
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                  );
                })
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={12}>
                      Tire Data Not Avilable
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
        {totalTires && !isLoading ? (
          <PaginationHelper
            totalRecords={totalTires}
            onPageChanged={page => {
              this.setState({ page });
              this.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}

        <CrmTyreModal
          tyreModalOpen={tireEditModalOpen}
          handleTierModal={() => {
            this.setState({ tier: {} })
            modelOperate({
              tireEditModalOpen: !tireEditModalOpen
            })
          }
          }
          tireData={tire}
          updateTire={this.onUpdate}
          getInventoryPartsVendors={this.props.getInventoryPartsVendors}
          vendorList={this.props.vendorReducer}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  tireReducer: state.tiresReducer,
  modelInfoReducer: state.modelInfoReducer,
  vendorReducer: state.vendorsReducer
});
const mapDispatchToProps = dispatch => ({
  getTires: data => {
    dispatch(getTiersList(data));
  },
  onStatusUpdate: data => {
    dispatch(updateTierStatus(data));
  },
  deleteTire: data => {
    dispatch(deleteTier(data));
  },
  updateTire: (id, data) => {
    dispatch(editTier({ id, data }));
  },
  getInventoryPartsVendors: data => {
    dispatch(getInventoryPartVendors(data));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tires);
