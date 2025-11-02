// src/components/audit/AuditDetailsModal.jsx

import Modal from "../common/Modal";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { formatDate } from "../../utils/formatters";
import {
  AUDIT_ACTION_LABELS,
  AUDIT_ACTION_COLORS,
} from "../../utils/constants";

function AuditDetailsModal({ isOpen, onClose, log }) {
  if (!log) return null;

  const getActionBadge = (action) => {
    const colors = AUDIT_ACTION_COLORS[action] || "bg-gray-100 text-gray-800";
    return colors;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Audit Log Details"
      size="lg"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Action Badge */}
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${getActionBadge(
              log.action
            )}`}
          >
            {AUDIT_ACTION_LABELS[log.action] || log.action}
          </span>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Timestamp
            </h3>
            <p className="text-sm text-gray-900">{formatDate(log.timestamp)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">User ID</h3>
            <p className="text-sm text-gray-900">{log.userId || "Unknown"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              IP Address
            </h3>
            <p className="text-sm text-gray-900">{log.ipAddress || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              User Agent
            </h3>
            <p className="text-sm text-gray-900 truncate" title={log.userAgent}>
              {log.userAgent || "N/A"}
            </p>
          </div>
        </div>

        {/* Details */}
        {log.details && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Details</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
                {typeof log.details === "string"
                  ? log.details
                  : JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Metadata */}
        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Metadata</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="space-y-2">
                {Object.entries(log.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-sm text-gray-600">{key}:</dt>
                    <dd className="text-sm text-gray-900 font-medium">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Log ID */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Log ID</h3>
          <p className="text-xs text-gray-500 font-mono">{log.id}</p>
        </div>
      </div>
    </Modal>
  );
}

export default AuditDetailsModal;
