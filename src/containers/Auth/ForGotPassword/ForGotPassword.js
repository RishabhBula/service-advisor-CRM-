import React from "react";
import { connect } from "react-redux";
import { forgetPasswordRequest } from "../../../actions";

import ForgotpasswordPage from "../../../components/ForgotpasswordPage";

const ForGotPassword = props => (
  <ForgotpasswordPage onRequest={props.onRequest} />
);

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => {
  return {
    onRequest: data => {
      dispatch(forgetPasswordRequest(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ForGotPassword);
