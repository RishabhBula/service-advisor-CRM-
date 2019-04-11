import React, { Component } from "react";
import { connect } from "react-redux";
import { loginRequest } from "../../../actions";
import LoginPage from "../../../components/LoginPage";
class Login extends Component {
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.redirectTo("/dashboard");
    }
  }
  render() {
    const { onLogin } = this.props;
    return <LoginPage onLogin={onLogin} />;
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => {
  return {
    onLogin: data => {
      dispatch(loginRequest(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
