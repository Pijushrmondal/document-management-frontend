// src/components/webhooks/WebhookCard.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteWebhook } from "../../store/slices/webhookSlice";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import ConfirmDialog from "../common/ConfirmDialog";
import { WEBHOOK_EVENT_TYPE_LABELS } from "../../utils/constants";

function WebhookCard({ webhook, onEdit, onTest }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await dispatch(deleteWebhook(webhook.id)).unwrap();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(webhook);
  };

  const handleTestClick = (e) => {
    e.stopPropagation();
    if (onTest) onTest(webhook);
  };

  const handleCardClick = () => {
    navigate(`/webhooks/${webhook.id}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔗</span>
              <Badge variant={webhook.isActive ? "success" : "default"}>
                {webhook.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <h3
              className="text-sm font-medium text-gray-900 truncate"
              title={webhook.url}
            >
              {webhook.url}
            </h3>
          </div>
        </div>

        {/* Description */}
        {webhook.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {webhook.description}
          </p>
        )}

        {/* Events */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Subscribed Events:</p>
          <div className="flex flex-wrap gap-1">
            {webhook.events?.slice(0, 3).map((event, index) => (
              <Badge key={index} variant="default" size="sm">
                {WEBHOOK_EVENT_TYPE_LABELS[event] || event}
              </Badge>
            ))}
            {webhook.events?.length > 3 && (
              <Badge variant="default" size="sm">
                +{webhook.events.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={handleTestClick}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            🧪 Test
          </button>
          <button
            onClick={handleEditClick}
            className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={handleDeleteClick}
            className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Webhook"
        message={`Are you sure you want to delete this webhook? This action cannot be undone and the endpoint will stop receiving events.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={loading}
      />
    </>
  );
}

export default WebhookCard;
