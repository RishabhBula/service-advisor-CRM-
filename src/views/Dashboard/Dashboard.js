import React, { Component } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CrmSubscriptionModel } from "../../components/common/CrmSubscriptionModal";
import { getSubscriptionPlanRequest, addSubscriptionRequest } from "../../actions"
//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    // const { modelInfoReducer, modelOperate } = this.props
    // const { modelDetails } = modelInfoReducer;
    // const { openSubscriptionModel } = modelDetails
    // modelOperate({
    //   openSubscriptionModel: !openSubscriptionModel
    // })
  }
          
  render() {
    const { modelInfoReducer, modelOperate, getSubscriptionPlanRequest, subscriptionReducer, addSubscriptionRequest } = this.props
    const { modelDetails } = modelInfoReducer;
    const { openSubscriptionModel, openSubPayementModel } = modelDetails
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className={"white-card"}>
              {/* <CardHeader>
                <h4>
                  <i className="fa fa-dashboard" /> Dashboard
                </h4>
              </CardHeader> */}
              <CardBody className={"custom-card-body position-relative"}>
                <h4 className={"text-center"}>Coming Soon</h4>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <CrmSubscriptionModel
          openSubscriptionModel={openSubscriptionModel}
          modelOperate={modelOperate}
          openSubPayementModel={openSubPayementModel}
          getSubscriptionPlanRequest={getSubscriptionPlanRequest}
          subscriptionReducer={subscriptionReducer}
          addSubscriptionRequest={addSubscriptionRequest}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  modelInfoReducer: state.modelInfoReducer,
  subscriptionReducer: state.subscriptionReducer,

});
const mapDispatchToProps = dispatch => ({
  getSubscriptionPlanRequest: () => {
    dispatch(getSubscriptionPlanRequest())
  },
  addSubscriptionRequest: (data) =>{
    dispatch( addSubscriptionRequest(data))
  }
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
