// src/components/tasks/KanbanBoard.jsx

import { useSelector } from "react-redux";
import { selectTasksByStatus } from "../../store/slices/taskSlice";
import KanbanColumn from "./KanbanColumn";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

function KanbanBoard({ loading, onTaskEdit, onTaskView }) {
  const todoTasks = useSelector(selectTasksByStatus("todo"));
  const inProgressTasks = useSelector(selectTasksByStatus("in_progress"));
  const doneTasks = useSelector(selectTasksByStatus("done"));

  const allTasks = [...todoTasks, ...inProgressTasks, ...doneTasks];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (allTasks.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No tasks yet"
        description="Create your first task to get started."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KanbanColumn
        status="todo"
        tasks={todoTasks}
        onTaskEdit={onTaskEdit}
        onTaskView={onTaskView}
      />
      <KanbanColumn
        status="in_progress"
        tasks={inProgressTasks}
        onTaskEdit={onTaskEdit}
        onTaskView={onTaskView}
      />
      <KanbanColumn
        status="done"
        tasks={doneTasks}
        onTaskEdit={onTaskEdit}
        onTaskView={onTaskView}
      />
    </div>
  );
}

export default KanbanBoard;
