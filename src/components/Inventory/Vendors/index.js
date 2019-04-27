import React, { Component } from "react";
import { connect } from "react-redux";
import * as qs from "query-string";
import { AppConfig } from "../../../config/AppConfig";
import Loader from "../../../containers/Loader/Loader";
import CrmInventoryVendor from "../../../components/common/CrmInventoryVendor";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import PaginationHelper from "../../../helpers/Pagination";
import { isEqual } from "../../../helpers/Object";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  FormGroup,
  InputGroup,
  Input,
  Label,
  UncontrolledTooltip,
} from "reactstrap";
import {
  getVendorsList,
  editVendor,
  deleteVendor,
} from "../../../actions";

class Vendors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendor:{},
      page:1,
      search:'',
      sort:'',
      filterApplied: false
    };
  }

  componentDidMount = () =>{
    const query = qs.parse(this.props.location.search);
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort } = qs.parse(lSearch);   
    this.props.getVendorsList({ ...query, page: query.page || 1 });
    this.setState({
      page: parseInt(page) || 1,
      sort: sort || "",
      search: search || ""
    });
  }

  componentDidUpdate({ vendorReducer, location }) {
    if (
      this.props.vendorReducer.vendorData.isSuccess !==
      vendorReducer.vendorData.isSuccess
    ) {
      if (this.props.vendorReducer.vendorData.isSuccess) {
        const query = qs.parse(this.props.location.search);
        this.props.getVendorsList({ ...query, page: query.page || 1 });
      }
    }
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      this.props.getVendorsList({ ...currQuery, page: currQuery.page || 1 });
    }
  }
  
  editVendor = vendor => {
    this.setState({ vendor: vendor }, () => {
      this.props.modelOperate({
        vendorEditModalOpen: true
      });
    });
  };

  onUpdate = (id, data) =>{
    this.props.updateVendor(id, data);
  }

  deleteVendor = async ( vendorId) => {
    const { value } = await ConfirmBox({
      text:"Do you want to delete this Vendor"
    });
    if (!value) {
      return;
    }
    const data = { vendorId: vendorId} 
    this.props.deleteVendor(data)
  }

  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join('?')
    );
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSearch = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      vendor: {}
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
    console.log("check")
    this.setState({
      page: 1,
      search: "",
      status: "",
      sort: "",
      type: "",
      vendors:{},
      filterApplied: false
    });
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(`$pathname`)].join("?"))
  };

  render() {
    const { vendor, page, search, sort } = this.state;
    const { vendorReducer, modelOperate, modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { vendorEditModalOpen } = modelDetails;
    const { vendors, isLoading, totalVendors } = vendorReducer;
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
                      placeholder="Search by vendor name, account number, contact person name, email"
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
        <Table responsive bordered >
          <thead>
            <tr>
              <th className={"text-center"}>S No.</th>
              <th>Vendor Name</th>
              <th width={"300"}>URL</th>
              <th>Account Number</th>
              <th>Contact Person</th>
              <th width={"250"}>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
            vendors.length ? vendors.map((vendor, index) => {
                return (
                  <tr key={index}>
                    <td className={"text-center"}>{(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.</td>
                      <td>{vendor.name}</td>
                    <td>{vendor.url ? <a href={vendor.url} target={"_blank"}>{vendor.url}</a> : 'NA'}</td>
                      <td>{vendor.accountNumber ? vendor.accountNumber : 'NA'}</td>
                      <td className={"text-capitalize"}>
                        {vendor.contactPerson.firstName ? vendor.contactPerson.firstName : 'NA'} &nbsp;
                        {vendor.contactPerson.firstName && vendor.contactPerson.lastName ? vendor.contactPerson.lastName : null}
                      </td>
                      <td>{vendor.contactPerson.email ? vendor.contactPerson.email : 'NA'}</td>
                      <td className={"text-capitalize"}>
                        {vendor.contactPerson.phoneNumber && vendor.contactPerson.phoneNumber.phone && vendor.contactPerson.phoneNumber.value !== '' ? vendor.contactPerson.phoneNumber.phone : 'NA'} 

                        {vendor.contactPerson.phoneNumber.value ? <span>&nbsp;<b>|</b>&nbsp;</span> : ''}

                        {vendor.contactPerson.phoneNumber && vendor.contactPerson.phoneNumber.value ? vendor.contactPerson.phoneNumber.value : 'NA'}
                      {console.log("vendor.contactPerson.phoneNumber check+++++++++",vendor.contactPerson.phoneNumber)}
                      </td>
                      <td>
                        <Button
                          color={"primary"}
                          size={"sm"}
                          onClick={() => this.editVendor(vendor)}
                          id={`edit-${vendor._id}`}
                        >
                          <i className={"fa fa-edit"} />
                        </Button>
                        <UncontrolledTooltip target={`edit-${vendor._id}`}>
                          Edit details of {vendor.name}
                        </UncontrolledTooltip>
                        &nbsp;
                        <Button
                          color={"danger"}
                          size={"sm"}
                          id={`delete-${vendor._id}`}
                          onClick={() => this.deleteVendor(vendor._id)}
                        >
                          <i className={"fa fa-trash"} />
                        </Button>
                        <UncontrolledTooltip target={`delete-${vendor._id}`}>
                          Delete {vendor.firstName}
                        </UncontrolledTooltip>
                      </td>
                  </tr>
                );
                })
                :
                <tr>
                  <td colSpan={"9"} className={"text-center"}>
                    No Vendor is available
                  </td>
                </tr>
            ) : (
                <tr>
                  <td className={"text-center"} colSpan={12}>
                    <Loader />
                  </td>
                </tr>
              )}
              
          </tbody>
        </Table>
        
        {totalVendors && !isLoading ? (
        <PaginationHelper
          totalRecords={totalVendors}
          onPageChanged={page => {
            this.setState({ page });
            this.onPageChange(page);
          }}
          currentPage={page}
          pageLimit={AppConfig.ITEMS_PER_PAGE}
        />
      ) : null}

        <CrmInventoryVendor
          updateVendor={this.onUpdate}
          vendorAddModalOpen={vendorEditModalOpen}
          handleVendorAddModal={() =>
            modelOperate({
              vendorEditModalOpen: !vendorEditModalOpen
            })
          }
          vendorData={vendor}
        />
      </>
    )
  }
}

const mapStateToProps = state => ({
  vendorReducer: state.vendorsReducer,
  modelInfoReducer: state.modelInfoReducer
});

const mapDispatchToProps = dispatch => ({
  getVendorsList: data => {
    dispatch(getVendorsList(data));
  },
  updateVendor: (id, data) => {
    dispatch(editVendor({id, data}));
  },
  deleteVendor: data => {
    dispatch(deleteVendor(data));
  },
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vendors);