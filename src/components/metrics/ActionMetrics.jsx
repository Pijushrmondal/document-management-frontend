// src/components/metrics/ActionMetrics.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActionMetrics,
  selectActionMetrics,
  selectMetricLoading,
} from "../../store/slices/metricsSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import MetricCard from "./MetricCard";
import { formatNumber } from "../../utils/helpers";

function ActionMetrics() {
  const dispatch = useDispatch();
  const metrics = useSelector(selectActionMetrics);
  const loading = useSelector(selectMetricLoading);

  useEffect(() => {
    dispatch(fetchActionMetrics());
  }, [dispatch]);

  if (loading && !metrics) {
    return (
      <Card title="Action Metrics">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </Card>
    );
  }

  if (!metrics) return null;

  return (
    <Card title="AI Action Statistics" subtitle="Action execution metrics">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Actions"
          value={metrics.total || 0}
          icon="🤖"
          color="purple"
        />
        <MetricCard
          title="Completed"
          value={metrics.completed || 0}
          icon="✅"
          color="green"
        />
        <MetricCard
          title="Failed"
          value={metrics.failed || 0}
          icon="❌"
          color="red"
        />
        <MetricCard
          title="Success Rate"
          value={`${Math.round(metrics.successRate || 0)}%`}
          icon="📊"
          color="blue"
        />
      </div>

      {/* Action Type Breakdown */}
      {metrics.byType && Object.keys(metrics.byType).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Actions by Type
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {type.replace("_", " ")}
                </span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(count / metrics.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {formatNumber(count)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credits Usage */}
      {metrics.creditsUsed !== undefined && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Credit Usage
          </h3>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Credits Used</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatNumber(metrics.creditsUsed)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Avg per Action</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatNumber(metrics.avgCreditsPerAction || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default ActionMetrics;
