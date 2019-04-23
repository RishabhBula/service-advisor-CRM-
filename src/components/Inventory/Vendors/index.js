import React, { Component } from "react";
import { connect } from "react-redux";
import * as qs from "query-string";

import {
  Table,
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
            {vendors.length ? vendors.map((vendor, index) => {
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
              }
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