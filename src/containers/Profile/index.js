import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col,
  Row
} from "reactstrap";
import GenralSettings from "../../components/Profile/GeneralSettings";
import UpdatePassword from "../../components/Profile/UpdatePassword"
import CompanySettings from "../../components/Profile/CompanySettings"
import { connect } from "react-redux";
import {
  updatePasswordRequest,
  profileSettingUpdateRequest
} from "../../actions";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const { profileInfo } = this.props;
    return (
      <Card className={"white-card"}>
        <CardBody className={"custom-card-body position-relative"}>
          <div className={"p-3 profile-setting-page"}>
            <Row>
              <Col lg={"7"} md={"7"} >
                <h3 className={"pb-3"}>Profile Settings</h3>
                <GenralSettings profileData={profileInfo} updateProfileSetting={this.props.profileSettingUpdateRequest} />
              </Col>
              <Col lg={"5"} md={"5"} >
                <h3 className={"pb-3"}>Change Password</h3>
                <UpdatePassword updatePassword={this.props.updatePasswordRequest} />                
              </Col>
            </Row>
            <hr className={"pb-3 mt-5"}/>
            <CompanySettings profileData={profileInfo} updateProfileSetting={this.props.profileSettingUpdateRequest} />
          </div>
        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  profileInfo: state.profileInfoReducer
});

const mapDispatchToProps = dispatch => ({
  updatePasswordRequest : data => {
    dispatch(updatePasswordRequest(data));
  },
  profileSettingUpdateRequest : data =>{
    dispatch(profileSettingUpdateRequest(data));
  }
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);