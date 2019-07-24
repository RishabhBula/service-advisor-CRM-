import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React from "react";

import {
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

import { logger } from "../../helpers/Logger";
import Loader from "../../containers/Loader/Loader";
import { AppRoutes } from "../../config/AppRoutes";
import serviceUser from "../../assets/service-user.png";
import serviceTyre from "../../assets/service-car.png";
import { serviceTotalsCalculation } from "../../helpers";
import Dollor from "../common/Dollor";

class WorkflowGridView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAction: []
    };
  }
  onDragEnd = result => {
    logger(result);
    const { destination, source, draggableId: orderId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    if (result.type === "droppableItem") {
      logger(source.droppableId, destination.droppableId);
      this.props.updateOrderOfOrderStatus({
        from: {
          index: parseInt(source.index),
          id: this.props.orderStatus[source.index]._id
        },
        to: {
          index: parseInt(destination.index),
          id: this.props.orderStatus[destination.index]._id
        }
      });
      return;
    }
    this.props.updateOrderStatus({
      from: source.droppableId,
      to: destination.droppableId,
      orderId,
      destinationIndex: destination.index,
      sourceIndex: source.index
    });
  };
  /**
   *
   */
  toggleOpenAction = ind => {
    const { openAction } = this.state;
    openAction.forEach(d => (d = false));
    openAction[ind] = !openAction[ind];
    this.setState({
      openAction
    });
  };
  /**
   *
   */
  renderActions = (status, ind) => {
    return (
      <Dropdown
        direction="down"
        isOpen={this.state.openAction[ind]}
        toggle={() => {
          this.toggleOpenAction(ind);
        }}
      >
        <DropdownToggle nav>
          <i className="fas fa-ellipsis-h icon" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            onClick={() =>
              this.props.deleteOrderStatus({
                orderStatusId: status._id,
                index: ind
              })
            }
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  };

  renderOrders = (status, tasks, orders, isLoading) => {
    let serviceCalculation = []
    if (orders[status._id] && orders[status._id].length) {
      orders[status._id].map((task, index) => {
        if (task.serviceId && task.serviceId.length) {
          serviceCalculation.push(serviceTotalsCalculation(task.serviceId))
        }
        return true
      })
    }
    return (
      <Droppable droppableId={status._id}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <React.Fragment key={task._id}>
                <Draggable draggableId={task._id} index={index}>
                  {/* {task.serviceId ?
                    serviceCalculation = serviceTotalsCalculation(task.serviceId) : null
                  } */}
                  {providedNew => (
                    <div
                      {...providedNew.draggableProps}
                      {...providedNew.dragHandleProps}
                      ref={providedNew.innerRef}
                      className={"content"}
                    >
                      <div
                        onClick={() => {
                          this.props.redirectTo(
                            `${AppRoutes.WORKFLOW_ORDER.url.replace(
                              ":id",
                              task._id
                            )}`
                          );
                        }}
                      >
                        <h5 className={"mb-0 "}>
                          <span>
                            {task.orderId ? `(#${task.orderId})` : null}
                          </span>
                          {"  "}
                          <span>{task.orderName || "Unnamed order"}</span>
                        </h5>
                        <div className={"content-title"}>
                          <span>
                            <img
                              src={serviceUser}
                              alt={"serviceUser"}
                              width={"18"}
                              height={"18"}
                            />
                          </span>
                          <span className={"text"}>
                            {"  "}
                            {task.customerId
                              ? `${task.customerId.firstName} ${" "} ${
                              task.customerId.lastName
                              }`
                              : "No Customer"}
                          </span>{" "}
                        </div>
                        <div className={"content-title"}>
                          <span>
                            <img
                              src={serviceTyre}
                              alt={"serviceUser"}
                              width={"18"}
                              height={"18"}
                            />
                          </span>
                          <span className={"text"}>
                            {"  "}
                            {task.vehicleId
                              ? `${task.vehicleId.make} ${" "} ${
                              task.vehicleId.modal
                              }`
                              : "No Vehicle"}
                          </span>
                        </div>
                      </div>
                      <span
                        className={"delete-icon"}
                        id={`delete-${task._id}`}
                      >
                        <i
                          className={"fa fa-trash pull-right"}
                          onClick={() => {
                            this.props.deleteOrder({
                              statusId: status._id,
                              index,
                              id: task._id
                            });
                          }}
                        />
                      </span>
                      <UncontrolledTooltip target={`delete-${task._id}`}>
                        Delete Order
                      </UncontrolledTooltip>
                      <div className={"pt-2 position-relative"}>
                        <div className={"service-total"}>
                          <span className={"text-black-50"}>Total:</span>
                          <Dollor
                            value={serviceCalculation[index].orderGrandTotal}
                          />
                        </div>
                        <span
                          className={"pr-2"}
                          id={`authorised-status-${task._id}`}
                        >
                          <i
                            className={
                              task.status
                                ? "fas fa-check text-success"
                                : "fas fa-check text-muted"
                            }
                          />
                        </span>
                        <UncontrolledTooltip
                          target={`authorised-status-${task._id}`}
                        >
                          {task.status ? "Authorised" : "Not Authorised"}
                        </UncontrolledTooltip>
                        <span className={"pr-2 text-dark"}>
                          <i className="nav-icon icons icon-calendar" />
                        </span>
                      </div>
                    </div>
                  )}
                </Draggable>
              </React.Fragment>
            ))}
            {isLoading ? <Loader /> : provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };
  /**
   *
   */
  render() {
    const { orderStatus, orderData } = this.props;
    const { orders, isLoading } = orderData;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable
          droppableId={`dropableId`}
          type="droppableItem"
          direction={"horizontal"}
        >
          {provided => (
            <div
              ref={provided.innerRef}
              style={{
                width: `${300 * orderStatus.length}px`
              }}
            >
              {orderStatus.map((status, index) => (
                <React.Fragment key={status._id}>

                  <Draggable draggableId={status._id} index={index}>
                    {provided => (
                      <>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={"workflow-grid-card"}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className={"title"}
                          >
                            <Row className={"m-0"}>
                              <Col sm={"12"}>
                                <div className={"workflow-heads"}>
                                  <h5>{status.name}</h5>
                                  <span>{this.renderActions(status, index)}</span>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          {this.renderOrders(
                            status,
                            orders[status._id] || [],
                            orders,
                            isLoading
                          )}
                        </div>
                        {provided.placeholder}
                      </>
                    )}
                  </Draggable>
                </React.Fragment>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default WorkflowGridView;
