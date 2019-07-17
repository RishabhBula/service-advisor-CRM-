import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button
} from "reactstrap";
import { CrmSubPaymentModalModel } from "../../components/common/CrmSubPaymentModal"
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
    const { subscriptionData, planId } = this.state
    return (
      <>
        <Modal
          isOpen={openSubscriptionModel}
          className='customer-modal custom-form-modal modal-lg'
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggle}>Subscription Plans</ModalHeader>
          <ModalBody>
            <Row>
              {
                subscriptionData && subscriptionData.length ? subscriptionData.map((data, index) => {
                  return (
                    <Col key={index} md={"6 d-flex justify-content-center"}>
                      <Card className={"w-75 subscription-modal"}>
                        <CardBody className={"justify-content-center"}>
                          <div className={"pt-4"}>
                            <h4 className={"pb-2 text-center"}>{data.name || "Unnamed Subscription"}</h4>
                            <h3 className={"text-primary text-center"}>${data.amount}<small>/month</small></h3>
                          </div>
                          <div className={"text-center"}>
                            <ul className="list-group">
                              <li className="list-group-item">{data.facilities.noOfLiscence} User License</li>
                            </ul>
                          </div>
                        </CardBody>
                        <CardFooter className={"d-flex justify-content-center"}>
                          <div>
                            <Button color={"primary"} onClick={() => this.handleSubPaymentModal(data._id)} className={"text-center btn"}>Subscribe</Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </Col>
                  )
                }) : null
              }
            </Row>
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
