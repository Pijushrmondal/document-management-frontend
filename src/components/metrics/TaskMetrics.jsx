// src/components/metrics/TaskMetrics.jsx

import { useSelector } from "react-redux";
import { selectMyMetrics, selectMetricLoading } from "../../store/slices/metricsSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import MetricCard from "./MetricCard";
import { formatNumber } from "../../utils/helpers";

function TaskMetrics() {
  const allMetrics = useSelector(selectMyMetrics);
  const loading = useSelector(selectMetricLoading);
  const metrics = allMetrics?.tasks;

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
    metrics?.total > 0
      ? Math.round((metrics.completed / metrics.total) * 100)
      : 0;

  return (
    <Card title="Task Statistics" subtitle="Task management metrics">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Total Tasks"
          value={metrics?.total || 0}
          icon="📋"
          color="blue"
        />
        <MetricCard
          title="Pending"
          value={metrics?.pending || 0}
          icon="⏳"
          color="yellow"
        />
        <MetricCard
          title="Completed"
          value={metrics?.completed || 0}
          icon="✅"
          color="green"
        />
      </div>

      {/* Completion Rate */}
      {metrics?.total > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Completion Rate
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-green-900">
                  {completionRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {formatNumber(metrics.completed)} / {formatNumber(metrics.total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default TaskMetrics;
