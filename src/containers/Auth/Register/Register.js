import React, { Component } from "react";
import { connect } from "react-redux";
import { resendRequest, signUpRequest } from "../../../actions/SignUp";
import RegisterPage from "../../../components/RegisterPage";
class Register extends Component {
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.redirectTo("/dashboard");
    }
  }
  render() {
    return (
      <RegisterPage
        onSignup={this.props.onSignup}
        redirectTo={this.props.redirectTo}
        onResendLink={this.props.onResendLink}
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
    onResendLink: data => {
      dispatch(resendRequest(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
