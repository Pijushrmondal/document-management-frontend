// src/components/tasks/KanbanColumn.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask, moveTask } from "../../store/slices/taskSlice";
import TaskCard from "./TaskCard";
import { TASK_STATUSES } from "../../utils/constants";

function KanbanColumn({ status, tasks, onTaskEdit, onTaskView }) {
  const dispatch = useDispatch();
  const [isDragOver, setIsDragOver] = useState(false);

  const statusConfig = TASK_STATUSES[status] || {
    label: status,
    color: "gray",
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.effectAllowed = "move";
    const taskId = task.id || task._id;
    const taskStatus = task.status || task.taskStatus || 'pending';
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("currentStatus", taskStatus);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData("taskId");
    const currentStatus = e.dataTransfer.getData("currentStatus");

    // Map Kanban status to API status
    // todo → pending, in_progress → in_progress, done → completed
    const statusMap = {
      'todo': 'pending',
      'in_progress': 'in_progress',
      'done': 'completed',
    };
    
    const apiStatus = statusMap[status] || status;

    // If dropped in same column, do nothing
    if (currentStatus === apiStatus) return;

    // Optimistic update
    dispatch(moveTask({ taskId, newStatus: apiStatus }));

    // API call using PATCH /tasks/:id with only status field
    try {
      await dispatch(updateTask({ 
        id: taskId, 
        updates: { status: apiStatus } 
      })).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
      // Revert on error
      dispatch(moveTask({ taskId, newStatus: currentStatus }));
    }
  };

  return (
    <div
      className={`bg-gray-50 rounded-lg p-4 min-h-[500px] flex flex-col transition-colors ${
        isDragOver ? "bg-blue-50 ring-2 ring-blue-400" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full bg-${statusConfig.color}-500`}
          ></div>
          <h3 className="font-semibold text-gray-900">{statusConfig.label}</h3>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3 flex-1">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
              <TaskCard task={task} onEdit={onTaskEdit} onView={onTaskView} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;
