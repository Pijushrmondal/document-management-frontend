// src/components/actions/ActionCard.jsx

import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import { formatRelativeTime } from "../../utils/formatters";
import {
  ACTION_STATUS_COLORS,
  ACTION_STATUS_LABELS,
  ACTION_TYPE_LABELS,
} from "../../utils/constants";

function ActionCard({ action }) {
  const navigate = useNavigate();

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

  const getScopeDisplay = () => {
    if (action.scope?.type === "folder") {
      return `📁 Folder: ${action.scope.name}`;
    } else if (action.scope?.type === "files") {
      return `📄 ${action.scope.ids?.length || 0} file(s)`;
    }
    return "Unknown scope";
  };

  return (
    <div
      onClick={() => navigate(`/actions/${action.id}`)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={getStatusVariant(action.status)}>
              {ACTION_STATUS_LABELS[action.status] || action.status}
            </Badge>
            {action.actions && action.actions.length > 0 && (
              <Badge variant="default">
                {ACTION_TYPE_LABELS[action.actions[0]] || action.actions[0]}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">{getScopeDisplay()}</p>
        </div>
        <span className="text-2xl">🤖</span>
      </div>

      {/* Message Preview */}
      {action.messages && action.messages.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-900 line-clamp-2">
            {action.messages[0].content}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatRelativeTime(action.createdAt)}</span>
        {action.outputs && action.outputs.length > 0 && (
          <span className="flex items-center">
            📎 {action.outputs.length} output
            {action.outputs.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

export default ActionCard;
