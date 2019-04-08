import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { generatePassword } from "../../../actions";
import GeneratePasswordPage from "../../../components/GeneratePasswordPage";
import { logger } from "../../../helpers/Logger";

class GeneratePassword extends Component {
  componentDidMount() {
    const { activationCode, userId } = this.props.match.params;
    if (!activationCode || !userId) {
      this.props.redirectTo("/404");
    }
  }
  generatePassword = password => {
    const { activationCode, userId } = this.props.match.params;
    this.props.generatePassword({
      password,
      userId,
      activeValue: activationCode,
    });
  };
  render() {
    return <GeneratePasswordPage onGenerate={this.generatePassword} />;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  verifyCode: data => {
    logger(data);
  },
  generatePassword: data => {
    dispatch(generatePassword(data));
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GeneratePassword)
);
