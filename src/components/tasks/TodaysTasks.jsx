// src/components/tasks/TodaysTasks.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodaysTasks,
  selectTodaysTasks,
  selectTaskLoading,
} from "../../store/slices/taskSlice";
import Card from "../common/Card";
import TaskCard from "./TaskCard";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

function TodaysTasks({ onTaskEdit, onTaskView }) {
  const dispatch = useDispatch();
  const todaysTasks = useSelector(selectTodaysTasks);
  const loading = useSelector(selectTaskLoading);

  useEffect(() => {
    dispatch(fetchTodaysTasks());
  }, [dispatch]);

  return (
    <Card
      title="Today's Tasks"
      subtitle={`${todaysTasks.length} task${
        todaysTasks.length !== 1 ? "s" : ""
      } due today`}
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : todaysTasks.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No tasks due today"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-3">
          {todaysTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onTaskEdit}
              onView={onTaskView}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export default TodaysTasks;
