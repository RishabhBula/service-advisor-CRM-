import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { logger } from "../../helpers/Logger";
const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Take out the garbage" },
    "task-2": { id: "task-2", content: "Watch my favorite show" },
    "task-3": { id: "task-3", content: "Charge my phone" },
    "task-4": { id: "task-4", content: "Cook dinner" },
    "task-5": { id: "task-5", content: "Take out the garbage" },
    "task-6": { id: "task-6", content: "Watch my favorite show" },
    "task-7": { id: "task-7", content: "Charge my phone" },
    "task-8": { id: "task-8", content: "Cook dinner" },
    "task-9": { id: "task-9", content: "Take out the garbage" },
    "task-10": { id: "task-10", content: "Watch my favorite show" },
    "task-11": { id: "task-11", content: "Charge my phone" },
    "task-12": { id: "task-12", content: "Cook dinner" },
    "task-13": { id: "task-13", content: "Take out the garbage" },
    "task-14": { id: "task-14", content: "Watch my favorite show" },
    "task-15": { id: "task-15", content: "Charge my phone" },
    "task-16": { id: "task-16", content: "Cook dinner" }
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3", "task-4", "task-15", "task-16"]
    },
    "column-2": {
      id: "column-2",
      title: "In progress",
      taskIds: ["task-5", "task-6", "task-7", "task-8", "task-14"]
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: ["task-12", "task-11", "task-10", "task-9", "task-13"]
    }
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2", "column-3"]
};

class WorkflowGridView extends React.Component {
  state = initialData;

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

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
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
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId];
            const tasks = column.taskIds.map(
              taskId => this.state.tasks[taskId]
            );
            return (
              <div className={"workflow-grid-card"} key={columnId}>
                <div className={"title"}>{column.title}</div>
                <Droppable droppableId={column.id}>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {tasks.map((task, index) => (
                        <Draggable
                          draggableId={task.id}
                          key={task.id}
                          index={index}
                        >
                          {providedNew => (
                            <div
                              {...providedNew.draggableProps}
                              {...providedNew.dragHandleProps}
                              ref={providedNew.innerRef}
                              className={"content"}
                            >
                              {task.content}
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
