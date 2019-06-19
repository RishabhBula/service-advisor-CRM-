import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  Row,
  Col
} from "reactstrap";

import { logger } from "../../helpers/Logger";
import Loader from "../../containers/Loader/Loader";
import { AppRoutes } from "../../config/AppRoutes";

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
          <i className="fas fa-ellipsis-h text-white" />
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
  /**
   *
   */
  renderOrders = (status, tasks, isLoading) => {
    return (
      <Droppable droppableId={status._id}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable draggableId={task._id} key={task._id} index={index}>
                {providedNew => (
                  <div
                    {...providedNew.draggableProps}
                    {...providedNew.dragHandleProps}
                    ref={providedNew.innerRef}
                    className={"content"}
                  >
                    <span onClick={() => {
                      this.props.redirectTo(
                        `${AppRoutes.WORKFLOW_ORDER.url.replace(
                          ":id",
                          task._id
                        )}`
                      );
                    }}>
                      {task.orderName || "Unnamed order"}
                    </span>
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
                  </div>
                )}
              </Draggable>
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
                            <Row>
                              <Col sm={"10"}>{status.name}</Col>
                              <Col sm={"2"}>
                                {this.renderActions(status, index)}
                              </Col>
                            </Row>
                          </div>
                          {this.renderOrders(
                            status,
                            orders[status._id] || [],
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
