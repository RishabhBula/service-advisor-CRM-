import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Button
} from "reactstrap";
import { CrmSubPaymentModalModel } from "../../components/common/CrmSubPaymentModal"
import "../../scss/subscription.scss"
import Dollor from "../common/Dollor"
export class CrmSubscriptionModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionData: [],
      planId: ""
    };
  }
  componentDidMount = () => {
    this.props.getSubscriptionPlanRequest()
  }
  componentDidUpdate = ({ subscriptionReducer }) => {
    if (subscriptionReducer.subscriptionPlanData !== this.props.subscriptionReducer.subscriptionPlanData) {
      this.setState({
        subscriptionData: this.props.subscriptionReducer.subscriptionPlanData
      })
    }
  }
  handleSubPaymentModal = (planId) => {
    const { modelOperate, openSubPayementModel } = this.props;
    modelOperate({
      openSubPayementModel: !openSubPayementModel
    })
    this.setState({
      planId
    })
  }

  render() {
    const { openSubscriptionModel, openSubPayementModel, addSubscriptionRequest } = this.props
    const {  planId } = this.state
    return (
      <>
        <Modal
          isOpen={openSubscriptionModel}
          className='customer-modal custom-form-modal modal-lg'
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggle}>Subscription Plans</ModalHeader>
          <ModalBody>
            <h5 className={"subscription-head-line"}>Get a monthly Subscription for uninterrupted access.</h5>
            <Row>
              <div className={"subscription-card-wrap d-flex justify-content-center"}>
                  <div className={"subscription-card"}>
                    <h4 className={"text-center"}>Core</h4>
                    <div className={"subscription-card-inner"}>
                      <h3 className={"text-primary text-center plan-price"}>
                        <Dollor value={70} /><small>/month</small>
                      </h3>
                      <div className={"text-center pt-3 pb-3 user-count"}>
                        1 User License
                      </div>
                      <div className={"notes"}>
                        Pay $10/user and add more users
                      </div>
                    </div>
                    <div className={"text-center"}>
                      <Button color={"primary"} onClick={this.handleSubPaymentModal} className={"text-center btn"}>Subscribe</Button>
                    </div>
                  </div>
              
                  <div className={"subscription-card"}>
                    <h4 className={"text-center"}>Enhanced</h4>
                    <div className={"subscription-card-inner"}>
                      <h3 className={"text-primary text-center plan-price"}>
                        <Dollor value={149} /><small>/month</small>
                      </h3>
                      <div className={"text-center pt-3 pb-3 user-count"}>
                        3 User License
                      </div>
                      <div className={"notes"}>
                        Pay $10/user and add more users
                      </div>
                    </div>
                    <div className={"text-center"}>
                      <Button color={"primary"} onClick={this.handleSubPaymentModal} className={"text-center btn"}>Subscribe</Button>
                    </div>
                  </div>
              </div>
            </Row>
            <br/>
          </ModalBody>
        </Modal>
        <CrmSubPaymentModalModel
          openSubPayementModel={openSubPayementModel}
          handleSubPaymentModal={this.handleSubPaymentModal}
          planId={planId}
          addSubscriptionRequest={addSubscriptionRequest}
        />
      </>
    );
  }
}
