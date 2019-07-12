import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import {
  getCustomerDetailsSuccess,
  customerGetRequest,
  modelOpenRequest,
  vehicleAddRequest,
  getOrderDetailsRequest
} from "../../../actions"
import { withRouter } from "react-router-dom";
import qs from "query-string";
import Loader from "../../../containers/Loader/Loader";
import { CustomerOrders } from "./customerOrder"
import { CustomerVehicles } from "./customerVehicles"
import { CustomerInfo } from "./customerInfo"

const CustomerTab = React.lazy(() => import("./customerTab"));

const CustomerTabs = [
  {
    name: "Orders"
  },
  {
    name: "Vehicles"
  },
  {
    name: "Customer Info"
  }
];
class CustomerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerData: [],
      customerId: "",
      activeTab: 0
    };
  }
  componentDidMount = () => {
    this.props.getCustomerDetailsSuccess();
    this.props.customerGetRequest()
    const query = qs.parse(this.props.location.search);
    const customerId = this.props.match.params.id
    this.props.getOrderDetailsRequest({ customerId: customerId })
    this.setState({
      customerId: this.props.match.params.id,
      activeTab: query.tab
        ? CustomerTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
        : 0
    });
  }
  componentDidUpdate = ({ customerListReducer, location }) => {
    if (((customerListReducer.getCustomerDetails !== this.props.customerListReducer.getCustomerDetails) && this.props.customerListReducer.customers.length) || customerListReducer.customers !== this.props.customerListReducer.customers) {
      this.setState({
        customerData: this.props.customerListReducer.customers
      })
    }
    if (this.props.location.search !== location.search) {
      const query = qs.parse(this.props.location.search);
      this.setState({
        activeTab: query.tab
          ? CustomerTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
          : 0
      });
    }
  }
  onTabChange = activeTab => {
    const customerDetailsUrl = "/customers/details/:id"
    this.props.redirectTo(
      `${customerDetailsUrl.replace(
        ":id",
        this.state.customerId
      )}?tab=${encodeURIComponent(CustomerTabs[activeTab].name)}`
    );
  };
  render() {
    const { customerData, customerId, activeTab } = this.state;
    const { modelOperate, modelInfoReducer, vehicleAddAction, orderReducer } = this.props
    const { customerOrders } = orderReducer;
    let customerDetails = {}
    if (customerData && customerData.length) {
      customerDetails = customerData.filter(customer => customer._id === customerId)
    }
    return (
      <>
        <div className={"p-3"}>
          <h3>{customerDetails[0] ? `${customerDetails[0].firstName} ${" "} ${customerDetails[0].lastName}` : null}</h3>
          {
            customerDetails[0] ? customerDetails[0].phoneDetail.map((phone, index) => {
              return (
                <div key={index}>
                  <i className={"fa fa-phone"} /> {phone.value}
                </div>
              )
            }) : null
          }
          {" "}
          <div><i className={"fa fa-envelope"} /> {customerDetails[0] ? customerDetails[0].email : null}</div>
        </div>
        <div className={"p-3"}>
          <div className={"position-relative"}>
            <Suspense fallback={"Loading.."}>
              <CustomerTab
                tabs={CustomerTabs}
                activeTab={activeTab}
                onTabChange={this.onTabChange}
              />
            </Suspense>
          </div>
          <Suspense fallback={<Loader />}>
            <React.Fragment>
              {activeTab === 0 ? (
                <CustomerOrders
                  customerOrders={customerOrders}
                  {...this.props}
                />) : null}
              {activeTab === 1 ?
                (<CustomerVehicles
                  customerVehicles={customerDetails[0] ? customerDetails[0].vehicles : []}
                  modelOperate={modelOperate}
                  modelInfoReducer={modelInfoReducer}
                  vehicleAddAction={vehicleAddAction}
                  customerId={customerDetails[0] ? customerDetails[0]._id : null}
                />) : null}
              {activeTab === 2 ? (<CustomerInfo />) : null}
            </React.Fragment>
          </Suspense>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => ({
  customerListReducer: state.customerListReducer,
  modelInfoReducer: state.modelInfoReducer,
  orderReducer: state.orderReducer,
});
const mapDispatchToProps = dispatch => ({
  getCustomerDetailsSuccess: () => {
    dispatch(getCustomerDetailsSuccess())
  },
  customerGetRequest: () => {
    dispatch(customerGetRequest())
  },
  modelOperate: data => {
    dispatch(modelOpenRequest({ modelDetails: data }));
  },
  vehicleAddAction: data => {
    dispatch(vehicleAddRequest(data));
  },
  getOrderDetailsRequest: data => {
    dispatch(getOrderDetailsRequest(data))
  }
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CustomerView));
