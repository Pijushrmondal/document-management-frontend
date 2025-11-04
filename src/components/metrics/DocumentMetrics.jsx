// src/components/metrics/DocumentMetrics.jsx

import { useSelector } from "react-redux";
import { selectMyMetrics, selectMetricLoading } from "../../store/slices/metricsSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import MetricCard from "./MetricCard";
import { formatFileSize } from "../../utils/formatters";
import { formatNumber } from "../../utils/helpers";

function DocumentMetrics() {
  const allMetrics = useSelector(selectMyMetrics);
  const loading = useSelector(selectMetricLoading);
  const metrics = allMetrics?.documents;

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <MetricCard
          title="Total Documents"
          value={metrics?.total || 0}
          icon="📄"
          color="blue"
        />
        <MetricCard
          title="This Month"
          value={metrics?.thisMonth || 0}
          icon="📅"
          color="purple"
        />
      </div>

      {/* Storage Info */}
      {allMetrics?.storage && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Storage Usage
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Storage:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatFileSize(allMetrics.storage.totalBytes || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total (MB):</span>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(allMetrics.storage.totalMB || 0)} MB
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default DocumentMetrics;
