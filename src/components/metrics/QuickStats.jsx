// src/components/metrics/QuickStats.jsx

import MetricCard from "./MetricCard";

function QuickStats({ metrics }) {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Documents"
        value={metrics.documents?.total || 0}
        icon="📄"
        color="blue"
        subtitle={`${metrics.documents?.thisMonth || 0} this month`}
      />
      <MetricCard
        title="AI Actions"
        value={metrics.actions?.total || 0}
        icon="🤖"
        color="purple"
        subtitle={`${metrics.actions?.thisMonth || 0} this month`}
      />
      <MetricCard
        title="Tasks"
        value={metrics.tasks?.total || 0}
        icon="📋"
        color="green"
        subtitle={`${metrics.tasks?.completed || 0} completed`}
      />
      <MetricCard
        title="Tags"
        value={metrics.tags?.total || 0}
        icon="🏷️"
        color="indigo"
        subtitle="Total tags"
      />
    </div>
  );
}

export default QuickStats;
