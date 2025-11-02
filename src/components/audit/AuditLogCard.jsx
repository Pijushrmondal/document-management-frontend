// src/components/audit/AuditLogCard.jsx

import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import { formatDate, formatRelativeTime } from "../../utils/formatters";
import {
  AUDIT_ACTION_LABELS,
  AUDIT_ACTION_COLORS,
} from "../../utils/constants";

function AuditLogCard({ log }) {
  const navigate = useNavigate();

  const getActionBadge = (action) => {
    const colors = AUDIT_ACTION_COLORS[action] || "bg-gray-100 text-gray-800";
    return colors;
  };

  const handleClick = () => {
    navigate(`/audit/${log.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getActionBadge(
              log.action
            )}`}
          >
            {AUDIT_ACTION_LABELS[log.action] || log.action}
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {formatRelativeTime(log.timestamp)}
        </span>
      </div>

      {/* User Info */}
      <div className="mb-3">
        <p className="text-sm text-gray-900">
          <span className="font-medium">User:</span> {log.userId || "Unknown"}
        </p>
        {log.ipAddress && (
          <p className="text-xs text-gray-500">IP: {log.ipAddress}</p>
        )}
      </div>

      {/* Details Preview */}
      {log.details && (
        <div className="text-xs text-gray-600 line-clamp-2">
          {typeof log.details === "string"
            ? log.details
            : JSON.stringify(log.details).substring(0, 100)}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">{formatDate(log.timestamp)}</p>
      </div>
    </div>
  );
}

export default AuditLogCard;
