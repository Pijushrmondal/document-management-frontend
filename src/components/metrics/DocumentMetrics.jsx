// src/components/metrics/DocumentMetrics.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocumentMetrics,
  selectDocumentMetrics,
  selectMetricLoading,
} from "../../store/slices/metricsSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import MetricCard from "./MetricCard";
import { formatFileSize } from "../../utils/formatters";
import { formatNumber } from "../../utils/helpers";

function DocumentMetrics() {
  const dispatch = useDispatch();
  const metrics = useSelector(selectDocumentMetrics);
  const loading = useSelector(selectMetricLoading);

  useEffect(() => {
    dispatch(fetchDocumentMetrics());
  }, [dispatch]);

  if (loading && !metrics) {
    return (
      <Card title="Document Metrics">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </Card>
    );
  }

  if (!metrics) return null;

  return (
    <Card title="Document Statistics" subtitle="File management metrics">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Total Documents"
          value={metrics.total || 0}
          icon="📄"
          color="blue"
        />
        <MetricCard
          title="Total Storage"
          value={formatFileSize(metrics.totalSize || 0)}
          icon="💾"
          color="purple"
        />
        <MetricCard
          title="Avg File Size"
          value={formatFileSize(metrics.avgSize || 0)}
          icon="📊"
          color="indigo"
        />
      </div>

      {/* File Type Breakdown */}
      {metrics.byFileType && Object.keys(metrics.byFileType).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Files by Type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics.byFileType)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([type, count]) => (
                <div key={type} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 uppercase">{type}</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatNumber(count)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {metrics.recentActivity && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Recent Activity
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uploaded Today:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(metrics.recentActivity.today || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uploaded This Week:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(metrics.recentActivity.week || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Uploaded This Month:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(metrics.recentActivity.month || 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default DocumentMetrics;
