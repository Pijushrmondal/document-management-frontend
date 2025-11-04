// src/pages/Metrics.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "../store/slices/authSlice";
import QuickStats from "../components/metrics/QuickStats";
import DocumentMetrics from "../components/metrics/DocumentMetrics";
import ActionMetrics from "../components/metrics/ActionMetrics";
import TaskMetrics from "../components/metrics/TaskMetrics";
import SystemMetrics from "../components/metrics/SystemMetrics";
import { USER_ROLES } from "../utils/constants";
import {
  fetchMyMetrics,
  selectMyMetrics,
  selectMetricLoading,
} from "../store/slices/metricsSlice";

function Metrics() {
  const dispatch = useDispatch();
  const myMetrics = useSelector(selectMyMetrics);
  const loading = useSelector(selectMetricLoading);
  const user = useSelector(selectUser);

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  useEffect(() => {
    dispatch(fetchMyMetrics());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Metrics & Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {isAdmin
            ? "System-wide metrics and performance data"
            : "Your personal metrics and statistics"}
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats metrics={myMetrics} />

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentMetrics />
        <ActionMetrics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskMetrics />
        {isAdmin && <SystemMetrics />}
      </div>
    </div>
  );
}

export default Metrics;
