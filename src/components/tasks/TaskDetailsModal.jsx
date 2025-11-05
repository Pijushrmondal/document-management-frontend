// src/components/tasks/TaskDetailsModal.jsx

import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import { Permissions } from "../../utils/permissions";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { formatDate } from "../../utils/formatters";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../utils/constants";

function TaskDetailsModal({ isOpen, onClose, task, onEdit }) {
  const user = useSelector(selectUser);
  
  if (!task) return null;

  // Check permissions
  const canWrite = user && Permissions.canWrite(user.role);

  const getStatusVariant = (status) => {
    switch (status) {
      case "done":
        return "success";
      case "in_progress":
        return "info";
      default:
        return "default";
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {canWrite && onEdit && (
            <Button variant="primary" onClick={() => onEdit(task)}>
              Edit Task
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusVariant(task.status)}>
            {TASK_STATUSES[task.status]?.label || task.status}
          </Badge>
          <Badge variant={getPriorityVariant(task.priority)}>
            {TASK_PRIORITIES[task.priority]?.label || task.priority}
          </Badge>
          {isOverdue && <Badge variant="danger">⚠️ Overdue</Badge>}
        </div>

        {/* Description */}
        {task.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Description
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Due Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
            <p
              className={`text-sm ${
                isOverdue ? "text-red-600 font-medium" : "text-gray-900"
              }`}
            >
              {task.dueDate ? formatDate(task.dueDate) : "No due date"}
            </p>
          </div>

          {/* Assignee */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Assignee</h3>
            <p className="text-sm text-gray-900">
              {task.assignee || "Unassigned"}
            </p>
          </div>

          {/* Created */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Created</h3>
            <p className="text-sm text-gray-900">
              {formatDate(task.createdAt)}
            </p>
          </div>

          {/* Updated */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Last Updated
            </h3>
            <p className="text-sm text-gray-900">
              {formatDate(task.updatedAt)}
            </p>
          </div>
        </div>

        {/* Task ID */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Task ID</h3>
          <p className="text-xs text-gray-500 font-mono">{task.id}</p>
        </div>
      </div>
    </Modal>
  );
}

export default TaskDetailsModal;
