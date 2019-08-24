import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import "../../../scss/subscription.scss";
import {CrmSubscriptionModel} from "../../common/CrmSubscriptionModal"
import moment from "moment";
import Dollor from "../../common/Dollor"

class SubscriptionSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      firstName: "",
      lastName: "",
      openSubscriptionUpdateModel:null
    };
  }

  componentDidMount = () => {
    if (
      this.props.profileData.profileInfo &&
      this.props.openSubscriptionUpdateModel
    ) {
      const { firstName, lastName } = this.props.profileData.profileInfo;
      const {openSubscriptionUpdateModel} = this.props
      this.setState({
        firstName,
        lastName,
        openSubscriptionUpdateModel
      });
    }
  };
  componentDidUpdate = ({ profileData }) => {
    if (profileData.profileInfo !== this.props.profileData.profileInfo) {
      const { firstName, lastName } = this.props.profileData.profileInfo;

      this.setState({
        firstName,
        lastName
      });
    }
  };
  handleSubscriptionModel = ()=>{
    const { openSubscriptionUpdateModel } = this.state;
    this.setState({
      openSubscriptionUpdateModel: !openSubscriptionUpdateModel
    });
  }



  render() {
    const { openSubscriptionUpdateModel } = this.state;
    const {
      profileData,
      subscriptionReducer,
      addSubscriptionRequest,
      getSubscriptionPlanRequest,
      openSubUpgradeModel,
      modelOperate,
      logOutRequest
    } = this.props;
    const planName = profileData.profileInfo.planId
      ? profileData.profileInfo.planId.planStripeDetails.nickname
      : "" || "Trial Plan";
    const expirationDate = profileData.profileInfo.planExiprationDate;
    const planUser = profileData.profileInfo.planId
      ? profileData.profileInfo.planId.facilities.noOfLiscence
      : 0 || "Limited";
    const amount =
      !profileData.profileInfo.isInTrialPeriod &&
      profileData.profileInfo.planId
        ? profileData.profileInfo.planId.amount
        : '';
    return (
      <div>
        <Row className={"mb-5 "}>
          <Col lg={"8"} md={"8"} className={"custom-form-modal"}>
            <h3 className={"pb-3"}>Subscription Details</h3>
            <div
              className={
                "p-3 d-flex subscription-plan justify-content-between align-items-center"
              }
            >
              <div className={"d-flex align-items-center"}>
                <i className="icons cui-dollar mr-3 plan-icon" />
                <div className={"d-flex flex-column"}>
                  <h4>
                    Currently <b className={"text-success"}>"{planName}"</b>{" "} plan
                    has been activated{" "}
                  </h4>
                  <span className={"plan-detail mr-4 text-muted"}>
                    Allowed:{" "}
                    <span className={"pl-2 text-dark"}>
                      {planUser} User(s)
                    </span>
                    {amount !== '' ? 
                    <>
                    <span className={"pl-2 pr-2"}>|</span>
                    Amount Paid:{" "}
                    <span>
                      <Dollor value={amount} />
                    </span>
                    </>
                    : null
                    }
                  </span>
                  <div className={"pt-2"}>
                    <Button
                      className={"btn-theme w-50"}
                      color={""}
                      size={"sm"}
                      onClick={this.handleSubscriptionModel}
                    >
                      Renew Subscription
                    </Button>
                  </div>
                </div>
              </div>
              <div className={"expire-block pr-3"}>
                <span className={"text-muted"}>Expired On</span>
                <div>
                  <i className="fas fa-calendar" />{" "}
                  {moment(expirationDate || "").format("MMM Do YYYY")}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <CrmSubscriptionModel
          handleSubscriptionModel={this.handleSubscriptionModel}
          openSubscriptionModel={openSubscriptionUpdateModel}
          modelOperate={modelOperate}
          openSubUpgradeModel={openSubUpgradeModel}
          getSubscriptionPlanRequest={getSubscriptionPlanRequest}
          subscriptionReducer={subscriptionReducer}
          addSubscriptionRequest={addSubscriptionRequest}
          isProfile={true}
          logOutRequest={logOutRequest}
        />
      </div>
    );
  }
}

export default SubscriptionSettings;
