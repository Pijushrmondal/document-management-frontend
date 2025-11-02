// src/components/metrics/MetricCard.jsx

import { formatNumber } from "../../utils/helpers";

function MetricCard({ title, value, icon, color = "blue", subtitle, trend }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-900",
    green: "bg-green-50 text-green-900",
    purple: "bg-purple-50 text-purple-900",
    yellow: "bg-yellow-50 text-yellow-900",
    red: "bg-red-50 text-red-900",
    indigo: "bg-indigo-50 text-indigo-900",
  };

  const bgClass = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`${bgClass} rounded-lg p-6 transition-transform hover:scale-105`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold">
          {typeof value === "number" ? formatNumber(value) : value}
        </p>
        {subtitle && <p className="text-xs opacity-75">{subtitle}</p>}
        {trend && (
          <div className="flex items-center text-xs">
            <span
              className={
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              }
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}
            </span>
            <span className="ml-1 opacity-75">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
