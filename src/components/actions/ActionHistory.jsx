// src/components/actions/ActionHistory.jsx

import ActionCard from "./ActionCard";
import EmptyState from "../common/EmptyState";
import LoadingSpinner from "../common/LoadingSpinner";

function ActionHistory({ actions, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!actions || actions.length === 0) {
    return (
      <EmptyState
        icon="🤖"
        title="No actions yet"
        description="Run your first action to see it here."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action) => (
        <ActionCard key={action.id} action={action} />
      ))}
    </div>
  );
}

export default ActionHistory;
