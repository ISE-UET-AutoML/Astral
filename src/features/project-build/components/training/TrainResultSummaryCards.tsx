import React from "react";
import { Trophy, Clock, FlaskConical } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, suffix }) => (
  <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-sm transition hover:border-gray-300 dark:hover:border-white/15">
    <div className="flex items-start gap-4">
      <div className="rounded-xl bg-blue-100 dark:bg-blue-950/40 p-3">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
          {value}
          {suffix && <span className="text-lg ml-1">{suffix}</span>}
        </p>
      </div>
    </div>
  </div>
);

export function TrainResultSummaryCards({ metrics, experiment, epoch }) {
  const mainMetric = metrics[0];
  const totalMinutes = experiment.actual_training_time || 0;
  const mins = Math.floor(totalMinutes);
  const secs = Math.round((totalMinutes - mins) * 60);

  const metricValue = mainMetric
    ? ((mainMetric.value ?? 0) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        icon={Trophy}
        title={`Final ${mainMetric?.metric ?? "Metric"} Score`}
        value={metricValue}
        suffix="%"
      />

      <StatCard
        icon={Clock}
        title="Training Duration"
        value={`${mins}m ${secs}s`}
      />

      <StatCard icon={FlaskConical} title="Total Epochs" value={epoch ?? 0} />
    </div>
  );
}
