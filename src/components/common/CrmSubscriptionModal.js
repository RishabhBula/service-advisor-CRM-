import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
  Button
} from "reactstrap";
import { CrmSubPaymentModalModel } from "../../components/common/CrmSubPaymentModal";
import "../../scss/subscription.scss";
import Dollor from "../common/Dollor";
export class CrmSubscriptionModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionData: [],
      planId: ""
    };
  }
  componentDidMount = () => {
    this.props.getSubscriptionPlanRequest();
  };
  componentDidUpdate = ({ subscriptionReducer }) => {
    if (
      subscriptionReducer.subscriptionPlanData !==
      this.props.subscriptionReducer.subscriptionPlanData
    ) {
      this.setState({
        subscriptionData: this.props.subscriptionReducer.subscriptionPlanData
      });
    }
  };
  handleSubPaymentModal = async planId => {
    const {
      modelOperate,
      openSubPayementModel,
      openSubUpgradeModel,
      isProfile
    } = this.props;
    await this.setState({
      planId: planId
    });
    if (!isProfile) {
      modelOperate({
        openSubPayementModel: !openSubPayementModel
      });
    } else {
      modelOperate({
        openSubUpgradeModel: !openSubUpgradeModel
      });
    }
  };

  handleLogout = () => {
    this.props.logOutRequest();
  };

  render() {
    const {
      openSubscriptionModel,
      openSubPayementModel,
      openSubUpgradeModel,
      addSubscriptionRequest,
      isProfile
    } = this.props;
    const { subscriptionData, planId } = this.state;

    return (
      <>
        <Modal
          isOpen={openSubscriptionModel}
          className="customer-modal custom-form-modal modal-lg"
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggle}>
            Subscription Plans
            {isProfile ? (
              <Button
                className="close"
                color={""}
                onClick={this.props.handleSubscriptionModel}
              >
                <span aria-hidden="true">×</span>
              </Button>
            ) : null}
          </ModalHeader>
          <ModalBody>
            <h5 className={"subscription-head-line"}>
              Get a monthly Subscription for uninterrupted access.
            </h5>
            <Row>
              <div
                className={
                  "subscription-card-wrap d-flex justify-content-center"
                }
              >
                {subscriptionData && subscriptionData.length
                  ? subscriptionData.map((plan, index) => {
                      return (
                        <div className={"subscription-card"} key={index}>
                          <h4 className={"text-center"}>{plan.name}</h4>
                          <div className={"subscription-card-inner"}>
                            <h3
                              className={"text-primary text-center plan-price"}
                            >
                              <Dollor value={plan.amount} />
                              <small>/month</small>
                            </h3>
                            <div className={"text-center pt-3 pb-3 user-count"}>
                              {plan.facilities.noOfLiscence} User License
                            </div>
                            <div className={"notes"}>
                              Pay $10/user and add more users
                            </div>
                          </div>
                          <div className={"text-center"}>
                            <Button
                              color={"primary"}
                              onClick={() =>
                                this.handleSubPaymentModal(plan._id)
                              }
                              className={"text-center btn"}
                            >
                              Subscribe
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </Row>
            <br />
          </ModalBody>
          {!isProfile ? (
            <ModalFooter className={"font-weight-bold"}>
              Click here to{" "}
              <span
                onClick={this.handleLogout}
                className={
                  "pl-2 d-inline-flex align-items-center text-primary cursor_pointer"
                }
              >
                <i class="icons icon-logout mr-2" /> Logout
              </span>
            </ModalFooter>
          ) : null}
        </Modal>
        <CrmSubPaymentModalModel
          openSubPayementModel={
            !isProfile ? openSubPayementModel : openSubUpgradeModel
          }
          handleSubPaymentModal={this.handleSubPaymentModal}
          planId={planId}
          addSubscriptionRequest={addSubscriptionRequest}
        />
      </>
    );
  }
}
