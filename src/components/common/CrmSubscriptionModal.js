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
    };
  }
  handleSubPaymentModal = () => {
    const { modelOperate, openSubPayementModel } = this.props;
    modelOperate({
      openSubPayementModel: !openSubPayementModel
    })
  }

  render() {
    const { openSubscriptionModel, openSubPayementModel } = this.props
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
              <Col md={"6 d-flex justify-content-center"}>
                <Card className={"w-75 subscription-modal"}>
                  <CardBody className={"justify-content-center"}>
                    <div className={"pt-4"}>
                      <h4 className={"pb-2 text-center"}>Core</h4>
                      <h3 className={"text-primary text-center"}>$69<small>/month</small></h3>
                    </div>
                    <div className={"text-center"}>
                      <ul className="list-group">
                        <li className="list-group-item">1 User License</li>
                      </ul>
                    </div>
                  </CardBody>
                  <CardFooter className={"d-flex justify-content-center"}>
                    <div>
                      <Button color={"primary"} onClick={this.handleSubPaymentModal} className={"text-center btn"}>Subscribe</Button>
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col md={"6 d-flex justify-content-center"}>
                <Card className={"w-75 subscription-modal"}>
                  <CardBody className={"justify-content-center"}>
                    <div className={"pt-4"}>
                      <h4 className={"pb-2 text-center"}>Enhanced</h4>
                      <h3 className={"text-primary text-center"}>$149<small>/month</small></h3>
                    </div>
                    <div className={"text-center"}>
                      <ul className="list-group">
                        <li className="list-group-item">3 User License</li>
                      </ul>
                    </div>
                  </CardBody>
                  <CardFooter className={"d-flex justify-content-center"}>
                    <div>
                      <Button color={"primary"} onClick={this.handleSubPaymentModal} className={"text-center btn"}>Subscribe</Button>
                    </div>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <CrmSubPaymentModalModel
          openSubPayementModel={openSubPayementModel}
          handleSubPaymentModal={this.handleSubPaymentModal}
        />
      </>
    );
  }
}
