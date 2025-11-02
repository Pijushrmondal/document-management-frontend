// src/components/metrics/SystemMetrics.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMetrics,
  selectAllMetrics,
  selectMetricLoading,
} from "../../store/slices/metricsSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import Badge from "../common/Badge";

function SystemMetrics() {
  const dispatch = useDispatch();
  const metrics = useSelector(selectAllMetrics);
  const loading = useSelector(selectMetricLoading);

  useEffect(() => {
    dispatch(fetchAllMetrics());
  }, [dispatch]);

  if (loading && !metrics) {
    return (
      <Card title="System Metrics">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </Card>
    );
  }

  if (!metrics || !metrics.system) return null;

  const { system } = metrics;

  return (
    <Card title="System Health" subtitle="Platform status and performance">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center space-x-4">
          <Badge
            variant={system.status === "healthy" ? "success" : "danger"}
            size="lg"
          >
            {system.status === "healthy" ? "✅ Healthy" : "⚠️ Issues Detected"}
          </Badge>
          {system.uptime && (
            <span className="text-sm text-gray-600">
              Uptime: <span className="font-medium">{system.uptime}</span>
            </span>
          )}
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {system.activeUsers !== undefined && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-blue-900">
                {system.activeUsers}
              </p>
            </div>
          )}
          {system.apiCalls !== undefined && (
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-purple-600 mb-1">API Calls (24h)</p>
              <p className="text-2xl font-bold text-purple-900">
                {system.apiCalls}
              </p>
            </div>
          )}
          {system.avgResponseTime !== undefined && (
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-green-600 mb-1">Avg Response</p>
              <p className="text-2xl font-bold text-green-900">
                {system.avgResponseTime}ms
              </p>
            </div>
          )}
          {system.errorRate !== undefined && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-xs text-yellow-600 mb-1">Error Rate</p>
              <p className="text-2xl font-bold text-yellow-900">
                {system.errorRate}%
              </p>
            </div>
          )}
        </div>

        {/* Storage Info */}
        {system.storage && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Storage</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used:</span>
                <span className="font-medium">{system.storage.used}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">{system.storage.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${system.storage.percentage || 0}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Database Info */}
        {system.database && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Database</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {system.database.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Connections</p>
                <p className="text-sm font-medium text-gray-900">
                  {system.database.connections}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default SystemMetrics;
