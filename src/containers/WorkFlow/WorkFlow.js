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
  FormFeedback
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
  deleteOrderRequest
} from "../../actions";
import { logger } from "../../helpers/Logger";
import CRMModal from "../../components/common/Modal";
import { toast } from "react-toastify";
import Validator from "js-object-validation";
import {
  AddOrderStatusValidation,
  AddOrderStatusMessages
} from "../../validations";

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
    this.props.getOrders();
  }
  /**
   *
   */
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        [e.target.name]: null
      }
    });
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
    this.setState({
      showMoveOptions: true,
      selectedOrderStatusToDelete: data
    });
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
          <button className={"nav-icon icon-plus btn btn-outline-dark"} />
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
  render() {
    const {
      orderReducer,
      updateOrderStatus,
      updateOrderOfOrderStatus,
      redirectTo
    } = this.props;
    const { orderData, orderStatus } = orderReducer;
    const { listView } = this.state;
    return (
      <>
        <Card className={"white-card position-relative"}>
          <CardBody>
            <Row className={"mb-4"}>
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
                      />
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
                      />
                    </div>
                  </div>
                  {this.renderAddNew()}
                </div>
              </Col>
              <Col className={"title-right-section invt-add-btn-block"}>
                <Button
                  onClick={this.handleOrder}
                  color={"primary"}
                  id={"add-Appointment"}
                >
                  <i className={"fa fa-plus mr-1"} /> New Quote
                </Button>
              </Col>
            </Row>
            <Row>
              <Col sm={"12"}>
                {listView ? (
                  <WorkflowListView
                    orderData={orderData}
                    orderStatus={orderStatus}
                    updateOrderStatus={updateOrderStatus}
                    deleteOrderStatus={this.deleteOrderStatus}
                    deleteOrder={this.deleteOrder}
                    redirectTo={redirectTo}
                  />
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <WorkflowGridView
                      orderData={orderData}
                      orderStatus={orderStatus}
                      updateOrderStatus={updateOrderStatus}
                      deleteOrderStatus={this.deleteOrderStatus}
                      updateOrderOfOrderStatus={updateOrderOfOrderStatus}
                      deleteOrder={this.deleteOrder}
                      redirectTo={redirectTo}
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
  orderReducer: state.orderReducer
});
const mapDispatchToProps = dispatch => ({
  addOrderRequest: data => dispatch(addOrderRequest(data)),
  getOrders: () => dispatch(getOrderList()),
  updateOrderStatus: data => dispatch(updateOrderStatus(data)),
  deleteOrderStatus: data => dispatch(deleteOrderStatusRequest(data)),
  addOrderStatus: data => dispatch(addOrderStatus(data)),
  updateOrderOfOrderStatus: data => dispatch(updateOrderOfOrderStatus(data)),
  deleteOrder: data => dispatch(deleteOrderRequest(data))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkFlow);
