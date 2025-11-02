// src/pages/AuditDetails.jsx

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuditLogById,
  selectCurrentAuditLog,
  selectAuditLoading,
} from "../store/slices/auditSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatDate } from "../utils/formatters";
import { AUDIT_ACTION_LABELS, AUDIT_ACTION_COLORS } from "../utils/constants";

function AuditDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const log = useSelector(selectCurrentAuditLog);
  const loading = useSelector(selectAuditLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchAuditLogById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Audit Log Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The audit log you're looking for doesn't exist.
        </p>
        <Button variant="primary" onClick={() => navigate("/audit")}>
          Back to Audit Logs
        </Button>
      </div>
    );
  }

  const getActionBadge = (action) => {
    const colors = AUDIT_ACTION_COLORS[action] || "bg-gray-100 text-gray-800";
    return colors;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/audit")}>
          ← Back
        </Button>
      </div>

      {/* Main Info Card */}
      <Card>
        <div className="space-y-6">
          {/* Action Badge */}
          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${getActionBadge(
                log.action
              )}`}
            >
              {AUDIT_ACTION_LABELS[log.action] || log.action}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Timestamp</p>
              <p className="text-base font-medium text-gray-900 mt-1">
                {formatDate(log.timestamp)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="text-base font-medium text-gray-900 mt-1">
                {log.userId || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">IP Address</p>
              <p className="text-base font-medium text-gray-900 mt-1">
                {log.ipAddress || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Action Type</p>
              <p className="text-base font-medium text-gray-900 mt-1">
                {log.action}
              </p>
            </div>
          </div>

          {/* User Agent */}
          {log.userAgent && (
            <div>
              <p className="text-sm text-gray-500 mb-1">User Agent</p>
              <p className="text-sm text-gray-900 break-all">{log.userAgent}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Details Card */}
      {log.details && (
        <Card title="Event Details">
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
              {typeof log.details === "string"
                ? log.details
                : JSON.stringify(log.details, null, 2)}
            </pre>
          </div>
        </Card>
      )}

      {/* Metadata Card */}
      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <Card title="Additional Metadata">
          <div className="bg-gray-50 rounded-lg p-4">
            <dl className="space-y-3">
              {Object.entries(log.metadata).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col sm:flex-row sm:justify-between"
                >
                  <dt className="text-sm font-medium text-gray-700">{key}:</dt>
                  <dd className="text-sm text-gray-900 mt-1 sm:mt-0 break-all">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>
      )}

      {/* Request Info Card */}
      {(log.method || log.endpoint) && (
        <Card title="Request Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {log.method && (
              <div>
                <p className="text-sm text-gray-500">HTTP Method</p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {log.method}
                </p>
              </div>
            )}
            {log.endpoint && (
              <div>
                <p className="text-sm text-gray-500">Endpoint</p>
                <p className="text-base font-medium text-gray-900 mt-1 break-all">
                  {log.endpoint}
                </p>
              </div>
            )}
            {log.statusCode && (
              <div>
                <p className="text-sm text-gray-500">Status Code</p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {log.statusCode}
                </p>
              </div>
            )}
            {log.responseTime && (
              <div>
                <p className="text-sm text-gray-500">Response Time</p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {log.responseTime}ms
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Log ID Card */}
      <Card title="Audit Log Information">
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Log ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
              {log.id}
            </dd>
          </div>
          {log.createdAt && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(log.createdAt)}
              </dd>
            </div>
          )}
        </dl>
      </Card>
    </div>
  );
}

export default AuditDetails;
