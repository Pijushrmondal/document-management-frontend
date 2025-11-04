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
            <h3 className="text-sm font-medium text-blue-900">
              {usage.monthly?.period 
                ? `Period: ${usage.monthly.period}` 
                : 'This Month'}
            </h3>
            <span className="text-2xl">📊</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Actions Run:</span>
              <span className="text-lg font-semibold text-blue-900">
                {formatNumber(usage.monthly?.actionsCount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Credits Used:</span>
              <span className="text-lg font-semibold text-blue-900">
                {formatNumber(usage.monthly?.totalCredits || 0)}
              </span>
            </div>
          </div>
          
          {/* Monthly Breakdown */}
          {usage.monthly?.breakdown && usage.monthly.breakdown.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h4 className="text-xs font-medium text-blue-800 mb-2">Daily Breakdown</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {usage.monthly.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-blue-700">{item.date}</span>
                    <div className="flex gap-2">
                      <span className="text-blue-900 font-medium">{item.credits} credits</span>
                      <span className="text-blue-600">({item.actionType})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All-Time Usage */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-900">All Time</h3>
            <span className="text-2xl">🏆</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-green-700">Total Credits:</span>
              <span className="text-lg font-semibold text-green-900">
                {formatNumber(usage.allTime?.totalCredits || 0)}
              </span>
            </div>
          </div>
          
          {/* Monthly Breakdown for All-Time */}
          {usage.allTime?.monthlyBreakdown && usage.allTime.monthlyBreakdown.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <h4 className="text-xs font-medium text-green-800 mb-2">Monthly Breakdown</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {usage.allTime.monthlyBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-green-700">{item.month}</span>
                    <span className="text-green-900 font-medium">{item.credits} credits</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default UsageStats;
