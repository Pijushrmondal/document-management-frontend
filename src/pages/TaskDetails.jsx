import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaskById,
  deleteTask,
  selectCurrentTask,
  selectTaskLoading,
} from "../store/slices/taskSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import { formatDate } from "../utils/formatters";
import { TASK_STATUSES, TASK_PRIORITIES } from "../utils/constants";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const task = useSelector(selectCurrentTask);
  const loading = useSelector(selectTaskLoading);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [id, dispatch]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const taskId = task.id || task._id;
      if (!taskId) {
        console.error("Task ID not found");
        setDeleteLoading(false);
        return;
      }
      await dispatch(deleteTask(taskId)).unwrap();
      navigate("/tasks");
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Task Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The task you're looking for doesn't exist.
        </p>
        <Button variant="primary" onClick={() => navigate("/tasks")}>
          Back to Tasks
        </Button>
      </div>
    );
  }

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/tasks")}>
            ← Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="primary"
              icon="✏️"
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              icon="🗑️"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusVariant(task.status)} size="lg">
                {TASK_STATUSES[task.status]?.label || task.status}
              </Badge>
              <Badge variant={getPriorityVariant(task.priority)} size="lg">
                {TASK_PRIORITIES[task.priority]?.label || task.priority}
              </Badge>
              {isOverdue && (
                <Badge variant="danger" size="lg">
                  ⚠️ Overdue
                </Badge>
              )}
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p
                  className={`text-base font-medium ${
                    isOverdue ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assignee</p>
                <p className="text-base font-medium text-gray-900">
                  {task.assignee || "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(task.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(task.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Task Information">
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Task ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                {task.id}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <CreateTaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          dispatch(fetchTaskById(id));
        }}
        existingTask={task}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </>
  );
}

export default TaskDetails;
