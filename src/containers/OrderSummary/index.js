import React, { Component } from "react";
// import {
//   Button,
//   Card,
//   CardBody
// } from "reactstrap";
import OrderSummary from "../../components/OrderSummary";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { verifyLinkRequest } from "../../actions";
import * as qs from "query-string";

class OrderSummaryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
    };
  }
  componentDidMount =()=>{
    const query = qs.parse(this.props.location.search);
    this.props.verifyLinkRequest(
      query
    )
  }
  render() {
    const { orderReducer} = this.props
    return (
      <OrderSummary orderReducer={orderReducer}/>
    )
  }
}

const mapStateToProps = state => ({
  orderReducer: state.orderReducer,
});

const mapDispatchToProps = dispatch => ({
  verifyLinkRequest: (data) => {
    dispatch(verifyLinkRequest(data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OrderSummaryView));