// src/components/metrics/TaskMetrics.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaskMetrics,
  selectTaskMetrics,
  selectMetricLoading,
} from "../../store/slices/metricsSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import MetricCard from "./MetricCard";
import { formatNumber } from "../../utils/helpers";

function TaskMetrics() {
  const dispatch = useDispatch();
  const metrics = useSelector(selectTaskMetrics);
  const loading = useSelector(selectMetricLoading);

  useEffect(() => {
    dispatch(fetchTaskMetrics());
  }, [dispatch]);

  if (loading && !metrics) {
    return (
      <Card title="Task Metrics">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </Card>
    );
  }

  if (!metrics) return null;

  const completionRate =
    metrics.total > 0
      ? Math.round((metrics.completed / metrics.total) * 100)
      : 0;

  return (
    <Card title="Task Statistics" subtitle="Task management metrics">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Tasks"
          value={metrics.total || 0}
          icon="📋"
          color="blue"
        />
        <MetricCard
          title="Completed"
          value={metrics.completed || 0}
          icon="✅"
          color="green"
        />
        <MetricCard
          title="In Progress"
          value={metrics.inProgress || 0}
          icon="⏳"
          color="yellow"
        />
        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon="📊"
          color="purple"
        />
      </div>

      {/* Status Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Tasks by Status
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-600 font-medium mb-1">TO DO</p>
            <p className="text-2xl font-bold text-blue-900">
              {formatNumber(metrics.todo || 0)}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-xs text-yellow-600 font-medium mb-1">
              IN PROGRESS
            </p>
            <p className="text-2xl font-bold text-yellow-900">
              {formatNumber(metrics.inProgress || 0)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-xs text-green-600 font-medium mb-1">DONE</p>
            <p className="text-2xl font-bold text-green-900">
              {formatNumber(metrics.completed || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Priority Breakdown */}
      {metrics.byPriority && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Tasks by Priority
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">🔴 High Priority:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(metrics.byPriority.high || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">🟡 Medium Priority:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(metrics.byPriority.medium || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">🟢 Low Priority:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(metrics.byPriority.low || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Tasks */}
      {metrics.overdue > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900">
                  Overdue Tasks
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Requires immediate attention
                </p>
              </div>
              <p className="text-3xl font-bold text-red-900">
                {formatNumber(metrics.overdue)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default TaskMetrics;
