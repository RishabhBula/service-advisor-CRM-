import React from "react";
import { Table, Nav, NavItem, NavLink, UncontrolledTooltip} from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import NoDataFound from "../common/NoFound";
import { AppRoutes } from "../../config/AppRoutes";
import serviceUser from "../../assets/service-user.png";
import serviceTyre from "../../assets/service-car.png";
import { serviceTotalsCalculation } from "../../helpers";
import Dollor from "../common/Dollor";
import Select from "react-select";

class WorkflowListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: null
    };
  }

  handleType = (destination, source, orderId) => {
    console.log(
      source + " source",
      destination.id + " destination",
      orderId,
      "e isprinted"
    );
    
    // this.props.updateOrderStatus({
    //   // from: source,
    //   // to: destination.id,
    //   // orderId,
    //   // destinationIndex: { index: 0, droppableId: destination.id },
    //   // sourceIndex: { index: 0, droppableId: source }
    //   orderId,
    //   orderStatus: destination,
    //   orderIndex:0
    // });
  };
  /**
   *
   */
  renderRow = (order, index) => {
    const { activeTab } = this.state;
    let serviceCalculation = {};
    serviceCalculation = serviceTotalsCalculation(order.serviceId);
    const { orderStatus } = this.props;
    const groupedOptions = [];
    orderStatus.map((status, index) => {
      return (
        //console.log(status),
        groupedOptions.push({ label: status.name, id: status._id })
      );
    });
    console.log(serviceCalculation,"serviceCalculation  ")
    
    return (
      <tr key={index}>
        <td className={""} width={300}>
          <div
            onClick={() =>
              this.props.redirectTo(
                `${AppRoutes.WORKFLOW_ORDER.url.replace(":id", order._id)}`
              )
            }
            className={"order-title"}
          >
            <div className={"order-id"}>
              <span className={"pr-2"}>
                <strong>{order.isInvoice ? "Invoice" : "Estimate"}</strong>
              </span>
              #{order.orderId || "---"}
            </div>
            
            {order.orderName || "Unnamed order"}
          </div>
        </td>
        <td width={220}>
          <div className={"d-flex"}>
            <img
              src={serviceUser}
              alt={"serviceUser"}
              width={"20"}
              height={"20"}
              className={"mr-1"}
            />
            {order && order.customerId
              ? order.customerId.firstName + " " + order.customerId.lastName
              : "No Customer"}
          </div>
        </td>
        <td>
          <div className={"d-flex"}>
            <img
              src={serviceTyre}
              alt={"serviceTyre"}
              width={"20"}
              height={"20"}
              className={"mr-1"}
            />
            {order && order.customerId
              ? order.vehicleId.make + " " + order.vehicleId.modal
              : "No Vehicle"}
          </div>
        </td>
        <td className={"pl-2"}>
          <Dollor value={serviceCalculation.orderGrandTotal} />
        </td>
        <td width={200}>
          {console.log(groupedOptions, "groupedOptions")}
          <Select
            defaultValue={groupedOptions.filter(
              item => item.id === order.workflowStatus
            )}
            options={groupedOptions}
            className="w-100 form-select"
            onChange={e => this.handleType(e, order.workflowStatus, order._id)}
            classNamePrefix={"form-select-theme"}
          />
          
        </td>
        <td>
          <span
            className={
              order.status
                ? "status-btn border-success text-success"
                : "status-btn"
            }
          >
            <i
              className={
                order.status
                  ? "fas fa-check text-success"
                  : "fas fa-check text-secondary"
              }
            />{" "}
            {order.status ? "Authorised" : "Not Authorised"}
          </span>
        </td>
        <td className={"delete-icon"}>
          <i
            className={"fa fa-trash"}
            onClick={() =>
              this.props.deleteOrder({
                statusId: activeTab,
                id: order._id,
                index
              })
            }
            id={`delete-${order._id}`}
          />
          <UncontrolledTooltip target={`delete-${order._id}`}>
            Delete Order
          </UncontrolledTooltip>
        </td>
      </tr>
    );
  };
  /**
   *
   */

  render() {
    const { orderStatus, orderData } = this.props;
    const { orders, isLoading } = orderData;
    let { activeTab } = this.state;
    if (!activeTab && orderStatus[0]) {
      activeTab = orderStatus[0]._id;
    }
    return (
      <div>
        <Nav pills className={"inventory-nav"}>
          {orderStatus
            ? orderStatus.map((tab, index) => {
                console.log(tab, "tab tab");
                return (
                  <NavItem key={index}>
                    <NavLink
                      href={tab.url}
                      active={tab._id === activeTab}
                      onClick={e => {
                        e.preventDefault();
                        this.setState({
                          activeTab: tab._id
                        });
                      }}
                    >
                      {tab.name}
                    </NavLink>
                  </NavItem>
                );
              })
            : null}
        </Nav>
        <Table className={"workflow-table"}>
          <thead>
            <tr>
              <th>Order Details</th>
              <th>Customer Details</th>
              <th>Vehicle Details</th>
              <th>Order Total</th>
              <th>Status</th>
              <th width={""}>Invoice</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td>
                  <Loader />
                </td>
              </tr>
            ) : orders && orders[activeTab] && orders[activeTab].length ? (
              orders[activeTab].map(this.renderRow)
            ) : (
              <tr>
                <td className={"text-center"} colSpan={6}>
                  <NoDataFound />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default WorkflowListView;
