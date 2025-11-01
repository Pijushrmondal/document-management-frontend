// src/components/common/EmptyState.jsx

function EmptyState({
  icon = "📭",
  title = "No data found",
  description = "Get started by creating a new item.",
  action = null,
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
