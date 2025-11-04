// src/components/metrics/ActionMetrics.jsx

import { useSelector } from "react-redux";
import { selectMyMetrics, selectMetricLoading } from "../../store/slices/metricsSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import MetricCard from "./MetricCard";
import { formatNumber } from "../../utils/helpers";

function ActionMetrics() {
  const allMetrics = useSelector(selectMyMetrics);
  const loading = useSelector(selectMetricLoading);
  const metrics = allMetrics?.actions;

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Total Actions"
          value={metrics?.total || 0}
          icon="🤖"
          color="purple"
        />
        <MetricCard
          title="This Month"
          value={metrics?.thisMonth || 0}
          icon="📅"
          color="blue"
        />
        <MetricCard
          title="Credits Used"
          value={metrics?.creditsUsed || 0}
          icon="💳"
          color="green"
        />
      </div>

      {/* Credits Usage */}
      {metrics?.creditsUsed !== undefined && (
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
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default ActionMetrics;
