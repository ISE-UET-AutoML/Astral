import { Button } from "src/components/ui/button";
import { Spinner } from "src/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { CheckCircle, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";



export function DeployHistorySection({
  recentPredictions,
  isLoadingPredictions,
  onViewPrediction,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4 dark:border-white/10">
        <span className="w-1 h-5 rounded-full bg-blue-500 shrink-0" />
        <Clock className="size-4 text-blue-500 dark:text-blue-400" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Recent Predictions
        </h2>
      </div>
      <div className="px-5 py-5">
        {isLoadingPredictions ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Spinner className="size-4" />
            Loading predictions...
          </div>
        ) : recentPredictions?.length ? (
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {recentPredictions.map((prediction) => {
              const filename = prediction.file_name || "Prediction file";
              const dateObject = new Date(prediction.created_at);
              const timeAgo = formatDistanceToNow(dateObject, { addSuffix: true });
              const exactTime = format(dateObject, "HH:mm:ss, dd/MM/yyyy");

              return (
                <div
                  key={prediction.id || `${filename}-${prediction.created_at}`}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {filename}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex cursor-help text-xs text-gray-500 dark:text-gray-400">
                              Predicted {timeAgo}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Exact time: {exactTime}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onViewPrediction(prediction)}
                    className="h-8 w-full rounded-xl border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  >
                    View
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-6 text-sm text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
            No prediction history yet.
          </div>
        )}
      </div>
    </div>
  );
}
