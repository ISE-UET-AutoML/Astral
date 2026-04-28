import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
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
    <Card className="rounded-2xl border border-gray-200 bg-white/95 shadow-lg dark:border-white/10 dark:bg-white/5">
      <CardHeader className="border-b border-gray-200 px-5 py-4 dark:border-white/10">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Clock className="size-5 text-blue-600 dark:text-blue-300" />
          Recent Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-5">
        {isLoadingPredictions ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Spinner className="size-4" />
            Loading predictions...
          </div>
        ) : recentPredictions?.length ? (
          <div className="divide-y divide-gray-200 dark:divide-white/10">
            {recentPredictions.map((prediction) => {
              const filename = prediction.file_name || "Prediction file";
              const dateObject = new Date(prediction.created_at);
              const timeAgo = formatDistanceToNow(dateObject, {
                addSuffix: true,
              });
              const exactTime = format(dateObject, "HH:mm:ss, dd/MM/yyyy");

              return (
                <div
                  key={prediction.id || `${filename}-${prediction.created_at}`}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <CheckCircle className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-300" />
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
                    className="w-full sm:w-auto"
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
      </CardContent>
    </Card>
  );
}
