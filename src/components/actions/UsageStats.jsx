// src/components/actions/UsageStats.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonthlyUsage,
  fetchAllTimeUsage,
  selectActionUsage,
  selectActionLoading,
} from "../../store/slices/actionSlice";
import Card from "../common/Card";
import LoadingSpinner from "../common/LoadingSpinner";
import { formatNumber } from "../../utils/helpers";

function UsageStats() {
  const dispatch = useDispatch();
  const usage = useSelector(selectActionUsage);
  const loading = useSelector(selectActionLoading);

  useEffect(() => {
    const now = new Date();
    dispatch(
      fetchMonthlyUsage({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      })
    );
    dispatch(fetchAllTimeUsage());
  }, [dispatch]);

  if (loading && !usage.monthly && !usage.allTime) {
    return (
      <Card title="Usage Statistics">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </Card>
    );
  }

  return (
    <Card title="Usage Statistics" subtitle="Track your action credits">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Usage */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-900">This Month</h3>
            <span className="text-2xl">📊</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Actions Run:</span>
              <span className="text-lg font-semibold text-blue-900">
                {formatNumber(usage.monthly?.count || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Credits Used:</span>
              <span className="text-lg font-semibold text-blue-900">
                {formatNumber(usage.monthly?.creditsUsed || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* All-Time Usage */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-900">All Time</h3>
            <span className="text-2xl">🏆</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-green-700">Total Actions:</span>
              <span className="text-lg font-semibold text-green-900">
                {formatNumber(usage.allTime?.count || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-700">Total Credits:</span>
              <span className="text-lg font-semibold text-green-900">
                {formatNumber(usage.allTime?.creditsUsed || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Types Breakdown */}
      {usage.allTime?.byType &&
        Object.keys(usage.allTime.byType).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              By Action Type
            </h3>
            <div className="space-y-2">
              {Object.entries(usage.allTime.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">
                    {type.replace("_", " ")}:
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

export default UsageStats;
