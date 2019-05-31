import React, { Component, Suspense } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
} from "reactstrap";
import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import {
  getOrderIdRequest,
  customerGetRequest,
  vehicleGetRequest,
  addNewInspection,
  addInspectionTemplate,
  addMessageTemplate,
  getMessageTemplate,
  getTemplateList,
  updateMessageTemplate,
  deleteMessageTemplate,
  searchMessageTemplateList
} from "../../actions";
import Services from "../../components/Orders/Services";
import Inspection from "../../components/Orders/Inspection";
import TimeClock from "../../components/Orders/TimeClock";
import Message from "../../components/Orders/Message";
import CustomerVehicle from "../../components/Orders/CutomerVehicle"
const OrderTab = React.lazy(() =>
  import("../../components/Orders/OrderTab")
);

export const OrderComponents = [
  {
    component: Services
  },
  {
    component: Inspection
  },
  {
    component: TimeClock
  },
  {
    component: Message
  }
];
const OrderTabs = [
  {
    name: AppRoutes.WORKFLOW_ORDER_SERVICES.name
  },
  {
    name: AppRoutes.WORKFLOW_ORDER_INSPECTION.name
  },
  {
    name: AppRoutes.WORKFLOW_ORDER_TIME_CLOCK.name
  },
  {
    name: AppRoutes.WORKFLOW_ORDER_MESSAGES.name
  }
];
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }
  componentDidMount() {
    this.props.getOrderId();
  }

  onTabChange = (activeTab) => {
    this.setState({
      activeTab: activeTab
    })
  }

  render() {
    const { activeTab } = this.state;
    const {
      getVehicleData,
      getCustomerData,
      modelInfoReducer,
      modelOperate,
      addNewInspection,
      addInspectionTemplate,
      addMessageTemplate,
      getMessageTemplate,
      getTemplateList,
      updateMessageTemplate,
      deleteMessageTemplate,
      searchMessageTemplateList
     } = this.props
    return (
      <div className="animated fadeIn">
        <Card className="white-card">
          <CardBody className={"custom-card-body inventory-card"}>
            <div className={"d-flex justify-content-between pb-4"}>
              <h3>Order (#{typeof this.props.orderReducer.orderId !== 'object' ? this.props.orderReducer.orderId : null})</h3>
              <Button color={"primary"}>Save Order</Button>
            </div>
            <CustomerVehicle
              getCustomerData={getCustomerData}
              getVehicleData={getVehicleData}
            />
            <div className={"position-relative"}>
              <Suspense fallback={"Loading.."}>
                <OrderTab
                  tabs={OrderTabs}
                  activeTab={activeTab}
                  onTabChange={this.onTabChange}
                />
              </Suspense>
              {/* <div className={"invt-add-btn-block"}>
                {this.renderAddNewButton()}
              </div> */}
            </div>
            <Suspense fallback={<Loader />}>
              <Switch>
                {OrderComponents.map((route, idx) => {
                  return route.component ? (
                    <>
                      {
                        activeTab === 0 ?
                          <Services
                            modelInfoReducer={modelInfoReducer}
                            modelOperate={modelOperate}
                          /> : null
                      }
                      {
                        activeTab === 1 ?
                          <Inspection addNewInspection={addNewInspection} inspectionData={this.props.inspectionReducer} addInspectionTemplate={addInspectionTemplate} getTemplateList={getTemplateList} addMessageTemplate={addMessageTemplate} getMessageTemplate={getMessageTemplate} updateMessageTemplate={updateMessageTemplate} deleteMessageTemplate={deleteMessageTemplate} searchMessageTemplateList={searchMessageTemplateList}/> : null
                      }
                      {
                        activeTab === 2 ?
                          <TimeClock /> : null
                      }
                      {
                        activeTab === 3 ?
                          <Message /> : null
                      }
                    </>
                  ) : null;
                })}
              </Switch>
            </Suspense>
          </CardBody>
        </Card>
        {/* {this.renderModals()} */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  orderReducer: state.orderReducer,
  inspectionReducer:state.inspectionReducer,
  modelInfoReducer: state.modelInfoReducer
});
const mapDispatchToProps = dispatch => ({
  getOrderId: () => {
    dispatch(getOrderIdRequest());
  },
  getCustomerData: (data) => {
    dispatch(customerGetRequest(data))
  },
  getVehicleData: (data) => {
    dispatch(vehicleGetRequest(data))
  },
  addNewInspection: (data) =>{
    dispatch(addNewInspection(data))
  },
  addInspectionTemplate : (data) =>{
    dispatch(addInspectionTemplate(data))
  },
  getTemplateList : (data) =>{
    dispatch(getTemplateList(data))
  },
  addMessageTemplate: (data) => {
    dispatch(addMessageTemplate(data))
  },
  getMessageTemplate: (data) => {
    dispatch(getMessageTemplate(data))
  },
  updateMessageTemplate:(data)=>{
    dispatch(updateMessageTemplate(data))
  }, 
  deleteMessageTemplate: (data) => {
    dispatch(deleteMessageTemplate(data))
  },
  searchMessageTemplateList: (data) => {
    dispatch(searchMessageTemplateList(data))
  }, 
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Order));
