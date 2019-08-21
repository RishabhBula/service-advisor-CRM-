import React, { Component } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import GenralSettings from "../../components/Profile/GeneralSettings";
import UpdatePassword from "../../components/Profile/UpdatePassword";
import CompanySettings from "../../components/Profile/CompanySettings";
import SubscriptionSettings from "../../components/Profile/SubscriptionSettings";
import { connect } from "react-redux";
import {
  updatePasswordRequest,
  profileSettingUpdateRequest,
  updateCompanyLogo,
  addSubscriptionRequest,
  getSubscriptionPlanRequest,
  modelOpenRequest,
  logOutRequest
} from "../../actions";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount =()=>{
    this.props.getSubscriptionPlanRequest();
  }

  render() {
    const {
      profileInfo,
      subscriptionReducer,
      modelInfoReducer,
      modelOperate,
      logoutUser,
      addSubscriptionRequest
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const {
      openSubUpgradeModel,
      openSubscriptionUpdateModel
    } = modelDetails;
    const profileSetting =
      profileInfo.profileInfo.permissions.isAllowedCompanySettings;

    return (
      <Card className={"white-card"}>
        <CardBody className={"custom-card-body position-relative"}>
          <div className={"p-3 profile-setting-page"}>
            <Row>
              <Col lg={"7"} md={"7"}>
                <h3 className={"pb-3"}>Profile Settings</h3>
                <GenralSettings
                  profileData={profileInfo}
                  updateProfileSetting={
                    this.props.profileSettingUpdateRequest
                  }
                  profileSetting={profileSetting}
                />
              </Col>
              <Col lg={"5"} md={"5"}>
                <h3 className={"pb-3"}>Change Password</h3>
                <UpdatePassword
                  updatePassword={this.props.updatePasswordRequest}
                />
              </Col>
            </Row>
            {profileSetting ? (
              <>
                <hr className={"pb-3 mt-5"} />

                <SubscriptionSettings
                  profileData={profileInfo}
                  openSubscriptionModel={openSubscriptionUpdateModel}
                  modelOperate={modelOperate}
                  openSubUpgradeModel={openSubUpgradeModel}
                  getSubscriptionPlanRequest={getSubscriptionPlanRequest}
                  subscriptionReducer={subscriptionReducer}
                  addSubscriptionRequest={addSubscriptionRequest}
                  logOutRequest={logoutUser}
                />
                <CompanySettings
                  profileData={profileInfo}
                  updateProfileSetting={
                    this.props.profileSettingUpdateRequest
                  }
                  onLogoUpdate={this.props.updateCompanyLogo}
                />
              </>
            ) : null}
          </div>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  profileInfo: state.profileInfoReducer,
  subscriptionReducer: state.subscriptionReducer,
  modelInfoReducer: state.modelInfoReducer
});

const mapDispatchToProps = dispatch => ({
  updatePasswordRequest: data => {
    dispatch(updatePasswordRequest(data));
  },
  profileSettingUpdateRequest: data => {
    dispatch(profileSettingUpdateRequest(data));
  },
  updateCompanyLogo: data => dispatch(updateCompanyLogo(data)),
  modelOperate: data => dispatch(modelOpenRequest({ modelDetails: data })),
  getSubscriptionPlanRequest: () => dispatch(getSubscriptionPlanRequest()),
  addSubscriptionRequest: data => dispatch(addSubscriptionRequest(data)),
  logoutUser: () => dispatch(logOutRequest())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
