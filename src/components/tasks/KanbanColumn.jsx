import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, moveTask } from "../../store/slices/taskSlice";
import { selectUser } from "../../store/slices/authSlice";
import { Permissions } from "../../utils/permissions";
import TaskCard from "./TaskCard";
import { TASK_STATUSES } from "../../utils/constants";

function KanbanColumn({ status, tasks, onTaskEdit, onTaskView }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isDragOver, setIsDragOver] = useState(false);

  // Check permissions
  const canWrite = user && Permissions.canWrite(user.role);

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

    // Check if user can write
    if (!canWrite) {
      return;
    }

    const taskId = e.dataTransfer.getData("taskId");
    const currentStatus = e.dataTransfer.getData("currentStatus");

    const statusMap = {
      'todo': 'pending',
      'in_progress': 'in_progress',
      'done': 'completed',
    };
    
    const apiStatus = statusMap[status] || status;

    if (currentStatus === apiStatus) return;

    dispatch(moveTask({ taskId, newStatus: apiStatus }));

    try {
      await dispatch(updateTask({ 
        id: taskId, 
        updates: { status: apiStatus } 
      })).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
      dispatch(moveTask({ taskId, newStatus: currentStatus }));
    }
  };

  return (
    <div
      className={`bg-gray-50 rounded-lg p-4 min-h-[500px] flex flex-col transition-colors ${
        isDragOver ? "bg-blue-50 ring-2 ring-blue-400" : ""
      } ${!canWrite ? "opacity-75" : ""}`}
      onDragOver={canWrite ? handleDragOver : undefined}
      onDragLeave={canWrite ? handleDragLeave : undefined}
      onDrop={canWrite ? handleDrop : undefined}
    >
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

      <div className="space-y-3 flex-1">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable={canWrite}
              onDragStart={canWrite ? (e) => handleDragStart(e, task) : undefined}
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
