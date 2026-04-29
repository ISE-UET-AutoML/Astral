import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { Info } from "lucide-react";

const getStatusBadge = (score) => {
  const numScore = Number(score);
  if (numScore >= 0.9) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        Excellent
      </span>
    );
  }
  if (numScore >= 0.7) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        Good
      </span>
    );
  }
  if (numScore >= 0.6) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
      Poor
    </span>
  );
};

export function TrainResultMetricsTable({ metrics }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        Comprehensive Metrics
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10">
              <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">
                Metric
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">
                Value
              </th>
              <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, idx) => {
              const value =
                typeof metric.value === "number"
                  ? metric.value.toFixed(2)
                  : metric.value;

              return (
                <tr
                  key={metric.key || metric.metric || idx}
                  className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {metric.metric}
                      </span>
                      {metric.description && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="inline-flex items-center"
                              >
                                <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              {metric.description}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {value}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {getStatusBadge(metric.value)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
