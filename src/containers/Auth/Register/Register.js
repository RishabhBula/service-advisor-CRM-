import React, { Component } from "react";
import { connect } from "react-redux";
import { signUpRequest } from "../../../actions/SignUp";
import RegisterPage from "../../../components/RegisterPage";
class Register extends Component {
  render() {
    return (
      <RegisterPage
        onSignup={this.props.onSignup}
        redirectTo={this.props.redirectTo}
      />
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => {
  return {
    onSignup: data => {
      dispatch(signUpRequest(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
