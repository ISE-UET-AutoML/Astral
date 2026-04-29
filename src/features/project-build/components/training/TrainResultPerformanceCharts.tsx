import LineGraph from "@/src/features/project-build/components/training/LineGraph";

export function TrainResultPerformanceCharts({ valGraphs }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        Training Performance
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(valGraphs).map(([metricName, metricData]) => (
          <div
            key={metricName}
            className="rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4"
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
