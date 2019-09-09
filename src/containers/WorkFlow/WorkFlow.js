import {
   Col,
   Row,
   Card,
   CardBody,
   Button,
   Input,
   Label,
   FormGroup,
   DropdownItem,
   DropdownToggle,
   DropdownMenu,
   Dropdown,
   InputGroup,
   FormFeedback,
   UncontrolledTooltip
} from "reactstrap";
import { connect } from "react-redux";
import React, { Component } from "react";
import WorkflowGridView from "../../components/Workflow/GridView";

import {
   getOrderList,
   updateOrderStatus,
   deleteOrderStatusRequest,
   addOrderStatus,
   updateOrderOfOrderStatus,
   addOrderRequest,
   deleteOrderRequest,
   getAppointments,
   addAppointmentRequest,
   updateOrderDetailsRequest
} from "../../actions";
import { logger } from "../../helpers/Logger";
import CRMModal from "../../components/common/Modal";
import { toast } from "react-toastify";
import Validator from "js-object-validation";
import {
   AddOrderStatusValidation,
   AddOrderStatusMessages
} from "../../validations";
import qs from "query-string";
import { AppRoutes } from "../../config/AppRoutes";

import * as classNames from "classnames";
import WorkflowListView from "../../components/Workflow/ListView";
import { ConfirmBox } from "../../helpers/SweetAlert";

class WorkFlow extends Component {
   constructor(props) {
      super(props);
      this.state = {
         showMoveOptions: false,
         selectedOrderStatusToDelete: {},
         newStatus: null,
         showAddNewOptions: false,
         orderStatusName: "",
         selectedFilter: "",
         errors: {
            orderStatusName: null
         },
         listView: false
      };
   }
   /**
    *
    */
   handleOrder = () => {
      this.props.addOrderRequest();
   };
   /**
    *
    */
   componentDidMount() {
      const { location } = this.props;
      const lSearch = location.search;
      const { filter } = qs.parse(lSearch);
      this.setState({
         selectedFilter: filter || "",
      });
      this.props.getOrders({ filter: filter });
   }
   /**
    *
    */
   handleInputChange = e => {
      const { name, value } = e.target;
      this.setState(
         {
            [name]: value,
         },
         () => this.props.getOrders({ filter: value })
      );
      if (value !== "") {
         this.props.redirectTo(`${AppRoutes.WORKFLOW.url}?${qs.stringify({ filter: value })}`);
      } else {
         this.props.redirectTo(`${AppRoutes.WORKFLOW.url}`);
      }
   };
   /**
    *
    */
   closeOptionModal = () =>
      this.setState({
         showMoveOptions: false,
         selectedOrderStatusToDelete: {},
         newStatus: null
      });
   /**
    *
    */
   renderOrderStatusMoveModal = () => {
      const {
         showMoveOptions,
         selectedOrderStatusToDelete,
         newStatus
      } = this.state;
      return {
         isOpen: showMoveOptions,
         headerText: "Choose Status to Move Current Orders",
         modalProps: {
            style: {
               width: 500
            }
         },
         toggle: this.closeOptionModal,
         footerButtons: [
            {
               text: "Close",
               onClick: this.closeOptionModal
            },
            {
               text: "Move and Delete it!",
               color: "primary",
               onClick: async () => {
                  if (!newStatus) {
                     toast.error("Please choose a status to move.");
                     return;
                  }
                  this.props.deleteOrderStatus({
                     statusId: selectedOrderStatusToDelete.orderStatusId,
                     newStatusId: newStatus
                  });
                  this.closeOptionModal();
               }
            }
         ]
      };
   };
   /**
    *
    */
   deleteOrderStatus = data => {
      const { orderReducer } = this.props;
      let abc = (data.orderStatusId);
      let check = orderReducer && orderReducer.orderData && orderReducer.orderData.orders ? orderReducer.orderData.orders : "";
      let result = check[abc] ? check[abc] : "";
      if (result && result.length > 0) {
         this.setState({
            showMoveOptions: true,
            selectedOrderStatusToDelete: data
         });
      } else {
         this.props.deleteOrderStatus({
            statusId: abc
         });
      }
      logger(data);
   };
   toggleAddNewOptions = () => {
      this.setState({
         showAddNewOptions: !this.state.showAddNewOptions
      });
   };
   /**
    *
    */
   toggleAddNewOrderStatus = () => {
      const { modelInfoReducer } = this.props;
      const { modelDetails } = modelInfoReducer;
      const { addOrderStatusModalOpen } = modelDetails;
      this.props.modelOperate({
         addOrderStatusModalOpen: !addOrderStatusModalOpen
      });
      this.setState({
         orderStatusName: ""
      })
   };
   /**
    *
    */
   deleteOrder = async data => {
      const { value } = await ConfirmBox({
         text: "Are you sure, you want to abandoned this order?"
      });
      if (!value) {
         return;
      }
      this.props.deleteOrder(data);
   };
   /**
    *
    */
   renderAddNew = () => {
      return (
         <Dropdown
            direction="down"
            isOpen={this.state.showAddNewOptions}
            toggle={this.toggleAddNewOptions}
         >
            <DropdownToggle nav>
               <button className={"nav-icon icon-plus btn btn-outline-dark"} id={"modify-order"} />
               <UncontrolledTooltip target={"modify-order"} >
                  Select to modify order
               </UncontrolledTooltip>
            </DropdownToggle>
            <DropdownMenu right>
               <DropdownItem onClick={this.handleOrder}>New Quote</DropdownItem>
               <DropdownItem onClick={this.toggleAddNewOrderStatus}>
                  New Order Status
               </DropdownItem>
            </DropdownMenu>
         </Dropdown>
      );
   };
   /**
    *
    */
   renderOrderSelectionModal = () => {
      const { selectedOrderStatusToDelete } = this.state;
      const { orderReducer } = this.props;
      const { orderStatus } = orderReducer;
      return (
         <CRMModal {...this.renderOrderStatusMoveModal()}>
            {orderStatus &&
               orderStatus.length &&
               orderStatus.map((stat, index) => {
                  return selectedOrderStatusToDelete.orderStatusId !== stat._id ? (
                     <FormGroup check key={index}>
                        <Label check>
                           <Input
                              type={"radio"}
                              id={`${index}-${Math.random()}`}
                              name={"selectedStatus"}
                              value={stat._id}
                              onClick={() => this.setState({ newStatus: stat._id })}
                           />
                           &nbsp;{stat.name}
                        </Label>
                     </FormGroup>
                  ) : null;
               })}
         </CRMModal>
      );
   };
   /**
    *
    */
   addOrderStatus = e => {
      e.preventDefault();
      const { orderStatusName } = this.state;
      const { isValid, errors } = Validator(
         { orderStatusName },
         AddOrderStatusValidation,
         AddOrderStatusMessages
      );
      logger(isValid, errors);
      if (!isValid) {
         this.setState({
            errors
         });
         return;
      }
      this.props.addOrderStatus({ name: orderStatusName });
   };
   /**
    *
    */
   getAddOrderStatusOptions = () => {
      const { modelInfoReducer } = this.props;
      const { modelDetails } = modelInfoReducer;
      const { addOrderStatusModalOpen } = modelDetails;
      return {
         isOpen: addOrderStatusModalOpen,
         headerText: "Add New Order Status",
         toggle: this.toggleAddNewOrderStatus,
         modalProps: {
            style: {
               width: 500
            }
         },
         footerButtons: [
            {
               text: "Close",
               onClick: this.toggleAddNewOrderStatus,
               type: "button"
            },
            {
               color: "primary",
               text: "Add",
               onClick: this.addOrderStatus,
               type: "submit"
            }
         ]
      };
   };
   /**
    *
    */
   renderAddStatusModal = () => {
      const { orderStatusName, errors } = this.state;
      return (
         <CRMModal {...this.getAddOrderStatusOptions()}>
            <Row className="justify-content-center">
               <Col md="12">
                  <FormGroup>
                     <InputGroup>
                        <Label
                           htmlFor="name"
                           className="customer-modal-text-style"
                           style={{ minWidth: "auto" }}
                        >
                           Status <span className={"asteric"}>*</span>
                        </Label>
                        <div className={"input-block"}>
                           <Input
                              type={"text"}
                              placeholder={"Invoice"}
                              onChange={this.handleInputChange}
                              value={orderStatusName}
                              name="orderStatusName"
                              invalid={errors.orderStatusName}
                           />
                           <FormFeedback>
                              {errors.orderStatusName ? errors.orderStatusName : null}
                           </FormFeedback>
                        </div>
                     </InputGroup>
                  </FormGroup>
               </Col>
            </Row>
         </CRMModal>
      );
   };
   /**
    * 
    */
   orderStatus = (type, value) => {
      const { profileInfoReducer } = this.props;
      const comapnyId = profileInfoReducer.profileInfo._id;
      const { orderReducer } = this.props;
      let payload = {};
      if (type === "authorizStatus") {
         payload = {
            status: value,
            _id: orderReducer.orderItems._id,
            authorizerId: comapnyId,
            isChangedOrderStatus: true,
            isAuthStatus: true,
            isOrderDetails: true
         };
      } else {
         payload = {
            isInvoice: value,
            _id: orderReducer.orderItems._id,
            authorizerId: comapnyId,
            isChangedOrderStatus: true,
            isInvoiceStatus: true,
            isAuthStatus: true,
            isOrderDetails: true
         };
      }
      this.props.updateOrderDetails(payload);
   };
   /**
    *
    */
   render() {
      const {
         orderReducer,
         updateOrderStatus,
         updateOrderOfOrderStatus,
         redirectTo,
         modelInfoReducer,
         getAppointments,
         addAppointment,
         appointmentReducer
      } = this.props;
      const { orderData, orderStatus } = orderReducer;
      const { listView, selectedFilter } = this.state;
      return (
         <>
            <Card className={"white-card position-relative"}>
               <CardBody className={"custom-card-body"}>
                  <Row className={"mb-2 ml-0"}>
                     <Col className={"title-left-section"}>
                        <h4 className={"card-title"}>Workflow</h4>
                        <div className={"workflow-mode"}>
                           <div className={"mode-inner"}>
                              <div className={"mode-flow"}>
                                 <button
                                    className={classNames(
                                       "nav-icon",
                                       "icon-list",
                                       "btn",
                                       "btn-outline-dark",
                                       { active: listView }
                                    )}
                                    onClick={() => this.setState({ listView: true })}
                                    id={"list-view"}
                                 />
                                 <UncontrolledTooltip target={"list-view"}>
                                    Click to view List
                                 </UncontrolledTooltip>
                              </div>
                              <div className="mode-flow">
                                 <button
                                    className={classNames(
                                       "nav-icon",
                                       "icon-grid",
                                       "btn",
                                       "btn-outline-dark",
                                       { active: !listView }
                                    )}
                                    onClick={() => this.setState({ listView: false })}
                                    id={"grid-view"}
                                 />
                                 <UncontrolledTooltip target={"grid-view"}>
                                    Click to view Grid
                                 </UncontrolledTooltip>
                              </div>
                           </div>
                           {this.renderAddNew()}
                        </div>
                     </Col>
                     <Col className={"title-right-section"}>
                        <div className={"invt-add-btn-block"}>
                           <Button
                              onClick={this.handleOrder}
                              color={"primary"}
                              id={"add-Appointment"}
                           >
                              <i className={"fa fa-plus mr-1"} /> New Quote
                           </Button>
                           <UncontrolledTooltip target={"add-Appointment"}>
                              Add a New Quote
                           </UncontrolledTooltip>
                        </div>
                        <div>
                           <div className="border workFlow-filter"><i className="fas fa-filter" /></div>
                        </div>
                        <div>
                           <Input
                              type={"select"}
                              name="selectedFilter"
                              className={"form-control"}
                              value={selectedFilter}
                              onChange={this.handleInputChange}
                           >
                              <option value={""}>All</option>
                              <option value={"authorized"}>Authorized</option>
                              <option value={"unauthorized"}>Unauthorized</option>
                              <option value={"paid"}>Paid</option>
                              <option value={"unpaid"}>Unpaid</option>
                              {/* <option value={"Archive"}>Archive</option> */}
                           </Input>
                        </div>
                     </Col>
                  </Row>
                  <Row>
                     <Col sm={"12"}>
                        {listView ? (
                           <WorkflowListView
                              orderData={orderData}
                              orderStatus={orderStatus}
                              orderStatus1={this.orderStatus}
                              updateOrderStatus={updateOrderStatus}
                              updateOrderOfOrderStatus={updateOrderOfOrderStatus}
                              deleteOrderStatus={this.deleteOrderStatus}
                              deleteOrder={this.deleteOrder}
                              redirectTo={redirectTo}
                              modelInfoReducer={modelInfoReducer}
                              addAppointment={addAppointment}
                              getAppointments={getAppointments}
                              appointmentReducer={appointmentReducer}
                           />
                        ) : (
                              <div style={{ overflowX: "auto" }}>
                                 <WorkflowGridView
                                    orderData={orderData}
                                    orderStatus={orderStatus}
                                    orderStatus1={this.orderStatus}
                                    updateOrderStatus={updateOrderStatus}
                                    deleteOrderStatus={this.deleteOrderStatus}
                                    updateOrderOfOrderStatus={updateOrderOfOrderStatus}
                                    deleteOrder={this.deleteOrder}
                                    redirectTo={redirectTo}
                                    modelInfoReducer={modelInfoReducer}
                                    addAppointment={addAppointment}
                                    getAppointments={getAppointments}
                                    appointmentReducer={appointmentReducer}
                                 />
                              </div>
                           )}
                     </Col>
                  </Row>
               </CardBody>
            </Card>
            {this.renderOrderSelectionModal()}
            {this.renderAddStatusModal()}
         </>
      );
   }
}
const mapStateToProps = state => ({
   orderReducer: state.orderReducer,
   modelInfoReducer: state.modelInfoReducer,
   appointmentReducer: state.appointmentReducer
});
const mapDispatchToProps = dispatch => ({
   addOrderRequest: data => dispatch(addOrderRequest(data)),
   getOrders: data => dispatch(getOrderList(data)),
   updateOrderStatus: data => dispatch(updateOrderStatus(data)),
   deleteOrderStatus: data => dispatch(deleteOrderStatusRequest(data)),
   addOrderStatus: data => dispatch(addOrderStatus(data)),
   updateOrderOfOrderStatus: data => dispatch(updateOrderOfOrderStatus(data)),
   deleteOrder: data => dispatch(deleteOrderRequest(data)),
   addAppointment: data => dispatch(addAppointmentRequest(data)),
   getAppointments: data => dispatch(getAppointments(data)),
   updateOrderDetails: data => {
      dispatch(updateOrderDetailsRequest(data));
   },
});
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(WorkFlow);
