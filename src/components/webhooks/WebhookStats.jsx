// src/components/webhooks/WebhookStats.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWebhookStats,
  selectWebhookStats,
  selectWebhookLoading,
} from "../../store/slices/webhookSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import { formatNumber } from "../../utils/helpers";

function WebhookStats() {
  const dispatch = useDispatch();
  const stats = useSelector(selectWebhookStats);
  const loading = useSelector(selectWebhookLoading);

  useEffect(() => {
    dispatch(fetchWebhookStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <Card title="Webhook Statistics">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </Card>
    );
  }

  return (
    <Card title="Webhook Statistics" subtitle="Event delivery metrics">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Webhooks */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-900">
              Total Webhooks
            </h3>
            <span className="text-2xl">🔗</span>
          </div>
          <p className="text-2xl font-semibold text-blue-900">
            {formatNumber(stats?.total || 0)}
          </p>
        </div>

        {/* Active Webhooks */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-900">Active</h3>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-2xl font-semibold text-green-900">
            {formatNumber(stats?.active || 0)}
          </p>
        </div>

        {/* Events Sent */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-900">Events Sent</h3>
            <span className="text-2xl">📤</span>
          </div>
          <p className="text-2xl font-semibold text-purple-900">
            {formatNumber(stats?.eventsSent || 0)}
          </p>
        </div>

        {/* Success Rate */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-yellow-900">
              Success Rate
            </h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-2xl font-semibold text-yellow-900">
            {stats?.successRate ? `${Math.round(stats.successRate)}%` : "0%"}
          </p>
        </div>
      </div>

      {/* Event Type Breakdown */}
      {stats?.byEventType && Object.keys(stats.byEventType).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Events by Type
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.byEventType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">
                  {type.replace(/\./g, " ")}:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatNumber(count)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default WebhookStats;
