// src/pages/WebhookDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWebhookById,
  deleteWebhook,
  regenerateWebhookSecret,
  selectCurrentWebhook,
  selectWebhookLoading,
} from "../store/slices/webhookSlice";
import { selectUser } from "../store/slices/authSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import CreateWebhookModal from "../components/webhooks/CreateWebhookModal";
import WebhookTestModal from "../components/webhooks/WebhookTestModal";
import { formatDate } from "../utils/formatters";
import { WEBHOOK_EVENT_TYPE_LABELS, USER_ROLES } from "../utils/constants";

function WebhookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const webhook = useSelector(selectCurrentWebhook);
  const loading = useSelector(selectWebhookLoading);
  const user = useSelector(selectUser);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [regenerateLoading, setRegenerateLoading] = useState(false);

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  useEffect(() => {
    if (id && isAdmin) {
      dispatch(fetchWebhookById(id));
    }
  }, [id, dispatch, isAdmin]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await dispatch(deleteWebhook(webhook.id)).unwrap();
      navigate("/webhooks");
    } catch (error) {
      console.error("Delete failed:", error);
      setDeleteLoading(false);
    }
  };

  const handleRegenerateSecret = async () => {
    setRegenerateLoading(true);
    try {
      await dispatch(regenerateWebhookSecret(webhook.id)).unwrap();
      setShowRegenerateDialog(false);
    } catch (error) {
      console.error("Regenerate failed:", error);
    } finally {
      setRegenerateLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-600 mb-6">
          Only administrators can view webhook details.
        </p>
        <Button variant="primary" onClick={() => navigate("/webhooks")}>
          Back to Webhooks
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!webhook) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Webhook Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The webhook you're looking for doesn't exist.
        </p>
        <Button variant="primary" onClick={() => navigate("/webhooks")}>
          Back to Webhooks
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/webhooks")}>
            ← Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              icon="🧪"
              onClick={() => setShowTestModal(true)}
            >
              Test
            </Button>
            <Button
              variant="primary"
              icon="✏️"
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              icon="🗑️"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Webhook Info */}
        <Card>
          <div className="space-y-6">
            {/* Status & URL */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🔗</span>
                <Badge
                  variant={webhook.isActive ? "success" : "default"}
                  size="lg"
                >
                  {webhook.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-gray-900 break-all">
                {webhook.url}
              </h1>
            </div>

            {/* Description */}
            {webhook.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-600">{webhook.description}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(webhook.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(webhook.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Event Types */}
        <Card
          title="Subscribed Events"
          subtitle={`${webhook.events?.length || 0} event types`}
        >
          <div className="flex flex-wrap gap-2">
            {webhook.events?.map((event, index) => (
              <Badge key={index} variant="primary" size="lg">
                {WEBHOOK_EVENT_TYPE_LABELS[event] || event}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Webhook Secret */}
        <Card
          title="Webhook Secret"
          subtitle="Use this to verify webhook authenticity"
        >
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <code className="text-sm text-green-400 font-mono">
                  {showSecret
                    ? webhook.secret
                    : "••••••••••••••••••••••••••••••••"}
                </code>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                    title={showSecret ? "Hide" : "Show"}
                  >
                    {showSecret ? "👁️" : "👁️‍🗨️"}
                  </button>
                  <button
                    onClick={() => copyToClipboard(webhook.secret)}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-900">
                  Regenerate Secret
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  This will invalidate the current secret
                </p>
              </div>
              <Button
                variant="warning"
                size="sm"
                onClick={() => setShowRegenerateDialog(true)}
              >
                Regenerate
              </Button>
            </div>
          </div>
        </Card>

        {/* Implementation Guide */}
        <Card title="Implementation Guide">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Verify Webhook Signature
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {`// Node.js example
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Expected Payload Format
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {`{
  "event": "document.uploaded",
  "timestamp": "2025-01-01T12:00:00Z",
  "data": {
    "id": "doc123",
    "filename": "example.pdf",
    ...
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Webhook ID */}
        <Card title="Webhook Information">
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Webhook ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                {webhook.id}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Edit Modal */}
      <CreateWebhookModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          dispatch(fetchWebhookById(id));
        }}
        existingWebhook={webhook}
      />

      {/* Test Modal */}
      <WebhookTestModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        webhook={webhook}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Webhook"
        message={`Are you sure you want to delete this webhook? The endpoint will stop receiving events immediately.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleteLoading}
      />

      {/* Regenerate Secret Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRegenerateDialog}
        onClose={() => setShowRegenerateDialog(false)}
        onConfirm={handleRegenerateSecret}
        title="Regenerate Secret"
        message="Are you sure you want to regenerate the webhook secret? The current secret will be invalidated immediately and you'll need to update your integration."
        confirmText="Regenerate"
        confirmVariant="warning"
        loading={regenerateLoading}
      />
    </>
  );
}

export default WebhookDetails;
