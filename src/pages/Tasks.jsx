// src/pages/Tasks.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  selectTasks,
  selectTaskLoading,
  fetchOverdueTasks,
  selectOverdueTasks,
} from "../store/slices/taskSlice";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import KanbanBoard from "../components/tasks/KanbanBoard";
import TaskStats from "../components/tasks/TaskStats";
import TodaysTasks from "../components/tasks/TodaysTasks";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal";

function Tasks() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectTaskLoading);
  const overdueTasks = useSelector(selectOverdueTasks);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showTodaysTasks, setShowTodaysTasks] = useState(true);

  useEffect(() => {
    dispatch(fetchTasks({ page: 1, limit: 100 }));
    dispatch(fetchOverdueTasks());
  }, [dispatch]);

  const handleCreateSuccess = () => {
    dispatch(fetchTasks({ page: 1, limit: 100 }));
    dispatch(fetchOverdueTasks());
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowDetailsModal(false);
    setShowCreateModal(true);
  };

  const handleTaskView = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditingTask(null);
  };

  const handleEditFromDetails = (task) => {
    setShowDetailsModal(false);
    setEditingTask(task);
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your tasks with Kanban board
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowTodaysTasks(!showTodaysTasks)}
          >
            {showTodaysTasks ? "Hide" : "Show"} Today's Tasks
          </Button>
          <Button
            variant="primary"
            icon="➕"
            onClick={() => setShowCreateModal(true)}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueTasks.length > 0 && (
        <Alert
          type="warning"
          title={`${overdueTasks.length} Overdue Task${
            overdueTasks.length !== 1 ? "s" : ""
          }`}
        >
          You have {overdueTasks.length} task
          {overdueTasks.length !== 1 ? "s" : ""} that are past their due date.
        </Alert>
      )}

      {/* Task Stats */}
      <TaskStats />

      {/* Today's Tasks */}
      {showTodaysTasks && (
        <TodaysTasks onTaskEdit={handleTaskEdit} onTaskView={handleTaskView} />
      )}

      {/* Kanban Board */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Kanban Board
        </h2>
        <KanbanBoard
          loading={loading}
          onTaskEdit={handleTaskEdit}
          onTaskView={handleTaskView}
        />
      </div>

      {/* Create/Edit Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        existingTask={editingTask}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
}

export default Tasks;
