import React from "react";
import { Table, Nav, NavItem, NavLink, UncontrolledTooltip } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import NoDataFound from "../common/NoFound";
import { AppRoutes } from "../../config/AppRoutes";
import serviceUser from "../../assets/service-user.png";
import serviceTyre from "../../assets/service-car.png";
import { serviceTotalsCalculation } from "../../helpers";
import Dollor from "../common/Dollor";
import Select from "react-select";
import moment from "moment";
import { ConfirmBox } from "../../helpers/SweetAlert";
import AddAppointment from "../Appointments/AddAppointment";
import AppointmentDetails from "../Appointments/AppointmentDetails";

class WorkflowListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: null,
      appointModalOpen: false,
      orderUserData: {},
      orderAppointment: [],
      showAppointmentDetailModal: false,
      appointmentDetail: ""
    };
  }

  componentDidMount = () => {
    this.props.getAppointments({
      technicianId: null,
      vehicleId: null,
      orderId: null
    });
  };

  handleOrderDetails = orderId => {
    this.props.redirectTo(
      `${AppRoutes.WORKFLOW_ORDER.url.replace(":id", orderId)}`
    );
  };
  /*
  /*  
  */
  handleVehicleDetails = vehicleId => {
    this.props.redirectTo(
      `${AppRoutes.VEHICLES_DETAILS.url.replace(":id", vehicleId)}`
    );
  };
  /*
  /*  
  */
  handleCustomerDetails = customerId => {
    this.props.redirectTo(
      AppRoutes.CUSTOMER_DETAILS.url.replace(":id", `${customerId}`)
    );
  };
  /*
  /*  
  */
  toggleAppointmentDetails = (e, details) => {
    const { showAppointmentDetailModal } = this.state;
    this.setState({
      showAppointmentDetailModal: !showAppointmentDetailModal,
      appointmentDetail: details || {}
    });
  };

  toggleAddAppointModal = async (e, task) => {
    if (task && !task.customerId) {
      await ConfirmBox({
        text: "",
        title: "Order doesn't have customer information",
        showCancelButton: false,
        confirmButtonText: "Ok"
      });
      return;
    }
    const { appointModalOpen } = this.state;
    this.setState({
      appointModalOpen: !appointModalOpen,
      orderUserData: task
    });
  };

  getAppointmentDetails = (id, task) => {
    const reducerData = this.props.appointmentReducer;
    const orders = reducerData.data.filter(order => order.orderId);
    let orderDetails = "";
    const orderMain = orders.filter(orderName => orderName.orderId._id === id);

    if (orderMain.length) {
      var day = orderMain.length;
      orderDetails = (
        <>
          <span
            className={"pr-2 text-dark cursor_pointer"}
            onClick={e => this.toggleAppointmentDetails(e, orderMain[0])}
          >
            <span className={"text-success"} id={`appoint-status-${id}`}>
              <i className="fa fa-calendar" />
            </span>
            <UncontrolledTooltip target={`appoint-status-${id}`}>
              Schedule on
              <br />
              {moment(orderMain[day > 0 ? day - 1 : 0].appointmentDate).format(
                "MMM Do YYYY"
              )}
            </UncontrolledTooltip>
          </span>
        </>
      );
    } else {
      orderDetails = (
        <>
          <span
            className={"pr-2 text-dark cursor_pointer"}
            onClick={e => this.toggleAddAppointModal(e, task)}
          >
            <span className={""} id={`appoint-status-${id}`}>
              <i className="fa fa-calendar" />
            </span>
            <UncontrolledTooltip target={`appoint-status-${id}`}>
              Click to schedule appointment
            </UncontrolledTooltip>
          </span>
        </>
      );
    }
    return orderDetails;
  };

  handleType = (e, workflowStatus, orderId, index) => {
    this.props.updateOrderStatus({
      from: workflowStatus,
      to: e.id,
      orderId,
      destinationIndex: 0,
      sourceIndex: index
    });
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
      return groupedOptions.push({ label: status.name, id: status._id });
    });
    const statusValue = groupedOptions.filter(
      item => item.id === order.workflowStatus
    );
    return (
      <tr key={index}>
        <td className={""} width={200}>
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
            {order && order.vehicleId
              ? order.vehicleId.make + " " + order.vehicleId.modal
              : "No Vehicle"}
          </div>
        </td>
        <td className={"pl-2"}>
          <Dollor value={serviceCalculation.orderGrandTotal} />
        </td>
        <td width={200} className={"fleet-block"}>
          <Select
            value={statusValue[0]}
            options={groupedOptions}
            className="w-100 form-select simple-select"
            onChange={e =>
              this.handleType(e, order.workflowStatus, order._id, index)
            }
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
        <td width={80}>{this.getAppointmentDetails(order._id, order)}</td>
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
    const { orderStatus, orderData, addAppointment } = this.props;
    const { orders, isLoading } = orderData;
    let { activeTab } = this.state;
    const {
      appointModalOpen,
      orderUserData,
      showAppointmentDetailModal,
      appointmentDetail
    } = this.state;
    if (!activeTab && orderStatus[0]) {
      activeTab = orderStatus[0]._id;
    }

    return (
      <div>
        <Nav pills className={"inventory-nav"}>
          {orderStatus
            ? orderStatus.map((tab, index) => {
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
        <div className={"table-responsive"}>
          <Table className={"workflow-table"}>
            <thead>
              <tr>
                <th>Order Details</th>
                <th>Customer Details</th>
                <th>Vehicle Details</th>
                <th>Order Total</th>
                <th>Status</th>
                <th width={""}>Invoice</th>
                <th>&nbsp;</th>
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
        <AddAppointment
          isOpen={appointModalOpen}
          toggleAddAppointModal={this.toggleAddAppointModal}
          date={new Date()}
          editData={""}
          orderData={orderUserData}
          addAppointment={addAppointment}
        />

        <AppointmentDetails
          isOpen={showAppointmentDetailModal}
          toggle={this.toggleAppointmentDetails}
          isLoading={false}
          data={appointmentDetail}
          // toggleEditAppointModal={this.toggleEditAppointModal}
          orderClick={this.handleOrderDetails}
          onCustomerClick={this.handleCustomerDetails}
          onVehicleClick={this.handleVehicleDetails}
          isTechnicianData={true}
        />
      </div>
    );
  }
}

export default WorkflowListView;
