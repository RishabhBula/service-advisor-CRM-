import React, { Component } from "react";
import { connect } from "react-redux";
import * as qs from "query-string";
import Loader from "../../../containers/Loader/Loader";
import {
  Table,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import {
  getVendorsList,
} from "../../../actions";

class Vendors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendros:{},

    };
  }

  componentDidMount = () =>{
    const query = qs.parse(this.props.location.search);
    this.props.getVendorsList({ ...query, page: query.page || 1 });
  }
  // componentDidUpdate({ vendorReducer, location }) {
  //   if (
  //     this.props.vendorReducer.vendorData.isSuccess !==
  //     vendorReducer.userData.isSuccess
  //   ) {
  //     console.log("we got it")
  //   }
  // }
  render() {
    // const { vendors } = this.state;

    const { vendorReducer } = this.props;
    const { vendors, isLoading, totalUsers } = vendorReducer;
  
    return (
      <>
        <Table responsive bordered className={"mt-3"}>
          <thead>
            <tr>
              <th className={"text-center"}>S No.</th>
              <th>Vendor Name</th>
              <th>URL</th>
              <th>Account Number</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
            vendors.length ? vendors.map((vendor, index) => {
                return (
                  <tr>
                      <td className={"text-center"}>{index + 1}</td>
                      <td>{vendor.name}</td>
                      <td>{vendor.url}</td>
                      <td>{vendor.accountNumber}</td>
                      <td><span className={"text-capitalize"}>{vendor.contactPerson.firstName}</span></td>
                      <td><span className={"text-capitalize"}>{vendor.contactPerson.lastName}</span></td>
                      <td>{vendor.contactPerson.email}</td>
                      <td>
                        <span className={"text-capitalize"}>{vendor.contactPerson.phoneNumber && vendor.contactPerson.phoneNumber.phone ? vendor.contactPerson.phoneNumber.phone : 'NA'}</span>&nbsp;<b>|</b>&nbsp;
                        {vendor.contactPerson.phoneNumber && vendor.contactPerson.phoneNumber.phone ? vendor.contactPerson.phoneNumber.value : 'NA'}
                      </td>
                      <td>
                        <Button
                          color={"primary"}
                          size={"sm"}
                          onClick={() => this.editVendor()}
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
                  <td colSpan={"9"}>
                    No any vendor is available
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
      </>
    )
  }
}

const mapStateToProps = state => ({
  vendorReducer: state.vendorsReducer,
});

const mapDispatchToProps = dispatch => ({
  getVendorsList: data => {
    dispatch(getVendorsList(data));
  },
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vendors);