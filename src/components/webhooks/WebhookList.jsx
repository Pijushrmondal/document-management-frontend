// src/components/webhooks/WebhookList.jsx

import WebhookCard from "./WebhookCard";
import EmptyState from "../common/EmptyState";
import LoadingSpinner from "../common/LoadingSpinner";

function WebhookList({ webhooks, loading, onEdit, onTest }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!webhooks || webhooks.length === 0) {
    return (
      <EmptyState
        icon="🔗"
        title="No webhooks configured"
        description="Create your first webhook to receive event notifications."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {webhooks.map((webhook) => (
        <WebhookCard
          key={webhook.id}
          webhook={webhook}
          onEdit={onEdit}
          onTest={onTest}
        />
      ))}
    </div>
  );
}

export default WebhookList;
