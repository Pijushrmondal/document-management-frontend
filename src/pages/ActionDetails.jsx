// src/pages/ActionDetails.jsx

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActionById,
  selectCurrentAction,
  selectActionLoading,
} from "../store/slices/actionSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatDate } from "../utils/formatters";
import { ACTION_STATUS_LABELS, ACTION_TYPE_LABELS } from "../utils/constants";

function ActionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const action = useSelector(selectCurrentAction);
  const loading = useSelector(selectActionLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchActionById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!action) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Action Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The action you're looking for doesn't exist.
        </p>
        <Button variant="primary" onClick={() => navigate("/actions")}>
          Back to Actions
        </Button>
      </div>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "failed":
        return "danger";
      case "running":
        return "info";
      default:
        return "warning";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/actions")}>
          ← Back
        </Button>
        <Badge variant={getStatusVariant(action.status)} size="lg">
          {ACTION_STATUS_LABELS[action.status] || action.status}
        </Badge>
      </div>

      {/* Action Info */}
      <Card title="Action Information">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Action ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">
              {action.id}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <Badge variant={getStatusVariant(action.status)}>
                {ACTION_STATUS_LABELS[action.status] || action.status}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Action Types</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {action.actions?.map((type, index) => (
                <Badge key={index} variant="default">
                  {ACTION_TYPE_LABELS[type] || type}
                </Badge>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(action.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Scope Type</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {action.scope?.type || "Unknown"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Scope Details</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {action.scope?.type === "folder"
                ? `📁 ${action.scope.name}`
                : `📄 ${action.scope?.ids?.length || 0} file(s)`}
            </dd>
          </div>
        </dl>
      </Card>

      {/* Messages */}
      {action.messages && action.messages.length > 0 && (
        <Card title="Instructions">
          <div className="space-y-3">
            {action.messages.map((msg, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">💬</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {msg.role === "user" ? "User" : "AI"}
                    </p>
                    <p className="text-sm text-gray-700">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Outputs */}
      {action.outputs && action.outputs.length > 0 && (
        <Card
          title="Generated Outputs"
          subtitle={`${action.outputs.length} file(s) generated`}
        >
          <div className="space-y-3">
            {action.outputs.map((output, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📎</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Output {index + 1}
                    </p>
                    <p className="text-xs text-gray-500">
                      Document ID: {output}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/documents/${output}`)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error Message */}
      {action.status === "failed" && action.error && (
        <Card title="Error">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{action.error}</p>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ActionDetails;
