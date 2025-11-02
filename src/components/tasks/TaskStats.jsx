// src/components/tasks/TaskStats.jsx

import { useSelector } from "react-redux";
import { selectTasks } from "../../store/slices/taskSlice";
import Card from "../common/Card";

function TaskStats() {
  const tasks = useSelector(selectTasks);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    overdue: tasks.filter(
      (t) =>
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
    ).length,
    highPriority: tasks.filter((t) => t.priority === "high").length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <Card>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-600">Total Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.todo}</p>
          <p className="text-xs text-gray-600">To Do</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {stats.inProgress}
          </p>
          <p className="text-xs text-gray-600">In Progress</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{stats.done}</p>
          <p className="text-xs text-gray-600">Done</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          <p className="text-xs text-gray-600">Overdue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {completionRate}%
          </p>
          <p className="text-xs text-gray-600">Completed</p>
        </div>
      </div>
    </Card>
  );
}

export default TaskStats;
