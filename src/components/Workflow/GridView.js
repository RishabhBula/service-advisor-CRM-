import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { logger } from "../../helpers/Logger";

class WorkflowGridView extends React.Component {
  onDragEnd = result => {
    logger(result);
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    this.props.updateOrderStatus({
      from: source.droppableId,
      to: destination.droppableId
    });
  };

  render() {
    const { orderStatus, orderData } = this.props;
    const { orders } = orderData;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div>
          {orderStatus.map(status => {
            const tasks = orders[status._id] || [];
            return (
              <div className={"workflow-grid-card"} key={status._id}>
                <div className={"title"}>{status.name}</div>
                <Droppable droppableId={status._id}>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {tasks.map((task, index) => (
                        <Draggable
                          draggableId={task._id}
                          key={task._id}
                          index={index}
                        >
                          {providedNew => (
                            <div
                              {...providedNew.draggableProps}
                              {...providedNew.dragHandleProps}
                              ref={providedNew.innerRef}
                              className={"content"}
                            >
                              {task.orderName || "Unnamed order"}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    );
  }
}

export default WorkflowGridView;
