import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { logger } from "../../helpers/Logger";

class WorkflowGridView extends React.Component {
  onDragEnd = result => {
    logger(result);
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const { orderData } = this.props;
    const { orders } = orderData;

    const start = orders[source.droppableId];
    const finish = orders[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start._id);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };

      this.setState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };
    this.setState(newState);
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
