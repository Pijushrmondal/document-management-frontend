// src/components/audit/AuditStats.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuditStats,
  selectAuditStats,
  selectAuditLoading,
} from "../../store/slices/auditSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import { formatNumber } from "../../utils/helpers";

function AuditStats() {
  const dispatch = useDispatch();
  const stats = useSelector(selectAuditStats);
  const loading = useSelector(selectAuditLoading);

  useEffect(() => {
    dispatch(fetchAuditStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <Card title="Audit Statistics">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </Card>
    );
  }

  return (
    <Card title="Audit Statistics" subtitle="System activity overview">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Logs */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-900">Total Logs</h3>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-2xl font-semibold text-blue-900">
            {formatNumber(stats?.total || 0)}
          </p>
        </div>

        {/* Today's Activity */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-900">Today</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-2xl font-semibold text-green-900">
            {formatNumber(stats?.today || 0)}
          </p>
        </div>

        {/* This Week */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-900">This Week</h3>
            <span className="text-2xl">📆</span>
          </div>
          <p className="text-2xl font-semibold text-purple-900">
            {formatNumber(stats?.week || 0)}
          </p>
        </div>

        {/* Unique Users */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-yellow-900">Users</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-2xl font-semibold text-yellow-900">
            {formatNumber(stats?.uniqueUsers || 0)}
          </p>
        </div>
      </div>

      {/* Action Type Breakdown */}
      {stats?.byAction && Object.keys(stats.byAction).length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Top Actions
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.byAction)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([action, count]) => (
                <div key={action} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {action.replace(/\./g, " ")}:
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

export default AuditStats;
