// src/components/tasks/TaskCard.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask } from "../../store/slices/taskSlice";
import Badge from "../common/Badge";
import ConfirmDialog from "../common/ConfirmDialog";
import { formatDate } from "../../utils/formatters";
import { TASK_PRIORITIES } from "../../utils/constants";

function TaskCard({ task, onEdit, onView, isDragging = false }) {
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(task);
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
    <>
      <div
        onClick={() => onView && onView(task)}
        className={`bg-white rounded-lg shadow hover:shadow-md transition-all p-4 cursor-pointer border-l-4 ${
          isDragging ? "opacity-50" : ""
        } ${
          task.priority === "high"
            ? "border-red-500"
            : task.priority === "medium"
            ? "border-yellow-500"
            : task.priority === "low"
            ? "border-green-500"
            : "border-gray-300"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900 flex-1 line-clamp-2">
            {task.title}
          </h4>
          <div className="flex gap-1 ml-2">
            <button
              onClick={handleEditClick}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant={getPriorityVariant(task.priority)} size="sm">
            {TASK_PRIORITIES[task.priority]?.label || task.priority}
          </Badge>
          {isOverdue && (
            <Badge variant="danger" size="sm">
              ⚠️ Overdue
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {task.dueDate ? (
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              📅 {formatDate(task.dueDate)}
            </span>
          ) : (
            <span>No due date</span>
          )}
          {task.assignee && (
            <span className="flex items-center">👤 {task.assignee}</span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={loading}
      />
    </>
  );
}

export default TaskCard;
