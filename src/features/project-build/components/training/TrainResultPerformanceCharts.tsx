import LineGraph from "@/src/features/project-build/components/training/LineGraph";
import { cn } from "src/lib/utils";

export function TrainResultPerformanceCharts({ valGraphs }) {
  const entries = Object.entries(valGraphs);
  const n = entries.length;

  const gridClass = cn(
    "grid gap-6",
    n === 1 && "grid-cols-1",
    n === 2 && "grid-cols-1 sm:grid-cols-2",
    n === 3 && "grid-cols-1 md:grid-cols-3",
    n >= 4 && "grid-cols-1 sm:grid-cols-2",
  );

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        Training Performance
      </h2>
      <div className={gridClass}>
        {entries.map(([metricName, metricData]) => (
          <div
            key={metricName}
            className="min-w-0 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4"
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              {metricName.replace(/_/g, " ")}
            </p>
            <LineGraph data={metricData} />
          </div>
        ))}
      </div>
    </div>
  );
}
