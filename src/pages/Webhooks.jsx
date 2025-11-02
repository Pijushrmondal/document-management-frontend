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

  // Check if user is admin
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchWebhooks({ page: 1, limit: 20 }));
    }
  }, [dispatch, isAdmin]);

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

  // Restrict access to admin only
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            Only administrators can access webhook management.
          </p>
          <Alert type="warning" title="Admin Only">
            Webhooks are powerful integrations that require administrative
            privileges to configure.
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure webhook endpoints to receive event notifications
          </p>
        </div>
        <Button
          variant="primary"
          icon="➕"
          onClick={() => setShowCreateModal(true)}
        >
          Create Webhook
        </Button>
      </div>

      {/* Admin Badge */}
      <Alert type="info" title="Administrator Access">
        You have full access to create, edit, and delete webhooks.
      </Alert>

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
