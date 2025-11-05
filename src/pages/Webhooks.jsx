// src/pages/Webhooks.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWebhooks,
  selectWebhooks,
  selectWebhookPagination,
  selectWebhookLoading,
} from "../store/slices/webhookSlice";
import { selectUser } from "../store/slices/authSlice";
import { Permissions } from "../utils/permissions";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import Pagination from "../components/common/Pagination";
import WebhookList from "../components/webhooks/WebhookList";
import WebhookStats from "../components/webhooks/WebhookStats";
import CreateWebhookModal from "../components/webhooks/CreateWebhookModal";
import WebhookTestModal from "../components/webhooks/WebhookTestModal";
import { USER_ROLES } from "../utils/constants";

function Webhooks() {
  const dispatch = useDispatch();
  const webhooks = useSelector(selectWebhooks);
  const pagination = useSelector(selectWebhookPagination);
  const loading = useSelector(selectWebhookLoading);
  const user = useSelector(selectUser);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const [testingWebhook, setTestingWebhook] = useState(null);

  // Permission checks
  const canWrite = user && Permissions.canWrite(user.role);
  const isReadOnly = user && Permissions.isReadOnly(user.role);
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  useEffect(() => {
    // All roles can view webhooks (according to backend)
    dispatch(fetchWebhooks({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchWebhooks({ page, limit: pagination.limit }));
  };

  const handleCreateSuccess = () => {
    dispatch(fetchWebhooks({ page: 1, limit: pagination.limit }));
  };

  const handleEdit = (webhook) => {
    setEditingWebhook(webhook);
    setShowCreateModal(true);
  };

  const handleTest = (webhook) => {
    setTestingWebhook(webhook);
    setShowTestModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditingWebhook(null);
  };

  const handleCloseTestModal = () => {
    setShowTestModal(false);
    setTestingWebhook(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="mt-1 text-sm text-gray-600">
            {isAdmin 
              ? "Configure webhook endpoints to receive event notifications"
              : "View webhook configurations and event history"}
          </p>
        </div>
        <div className="flex gap-2">
          {canWrite && (
            <Button
              variant="primary"
              icon="➕"
              onClick={() => setShowCreateModal(true)}
            >
              Create Webhook
            </Button>
          )}
          {isReadOnly && (
            <div className="flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-sm text-yellow-800">
                Read-only access
              </span>
            </div>
          )}
        </div>
      </div>

      {isReadOnly && (
        <Alert type="warning" title="Read-Only Access">
          Your role ({user?.role}) has read-only access. You can view webhooks but cannot create or modify them.
        </Alert>
      )}

      {/* Webhook Stats */}
      <WebhookStats />

      {/* Stats Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div>
              <p className="text-sm text-gray-500">Total Webhooks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pagination.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Webhooks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {webhooks.filter((w) => w.isActive).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Page</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pagination.page} / {pagination.totalPages}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Webhook List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Configured Webhooks
        </h2>
        <WebhookList
          webhooks={webhooks}
          loading={loading}
          onEdit={handleEdit}
          onTest={handleTest}
        />
      </div>

      {/* Pagination */}
      {!loading && webhooks.length > 0 && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      {/* Create/Edit Webhook Modal */}
      <CreateWebhookModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        existingWebhook={editingWebhook}
      />

      {/* Test Webhook Modal */}
      <WebhookTestModal
        isOpen={showTestModal}
        onClose={handleCloseTestModal}
        webhook={testingWebhook}
      />
    </div>
  );
}

export default Webhooks;
