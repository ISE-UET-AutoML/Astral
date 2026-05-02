import { Trophy, Clock, FlaskConical } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, suffix }) => (
  <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 backdrop-blur-sm transition dark:border-white/10 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/15">
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-blue-100 p-2 dark:bg-blue-950/40">
        <Icon className="size-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="truncate text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
          {value}
          {suffix && (
            <span className="ml-1 text-base font-semibold">{suffix}</span>
          )}
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
