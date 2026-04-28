import { Alert, AlertDescription } from "src/components/ui/alert";
import { Badge } from "src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import {
  ChartLine as LineChartOutlined,
  Hourglass as HourglassOutlined,
  Radar as RadarChartOutlined,
} from "lucide-react";
import { EnhancedLineGraph } from "./EnhancedLineGraph";
import { TrainingInfoMetrics } from "./TrainingInfoMetrics";

export function TrainingCharts({
  currentStep,
  valMetric,
  maxTrainingTime,
  enhancedChartData,
  loading,
  hasChartData,
  experimentName,
  trainingInfo,
  elapsedTime,
  status,
  metricExplain,
}) {
  if (currentStep < 3) return null;

  return (
    <TooltipProvider>
      <Card className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="m-0 flex items-center text-xl font-semibold text-gray-900 dark:text-white">
              <LineChartOutlined className="mr-2 text-blue-600 dark:text-blue-400" />
              {`${valMetric ? valMetric : "Accuracy"} Trend`}
            </CardTitle>
            {maxTrainingTime ? (
              <Badge className="border-none bg-amber-500 text-white">
                <HourglassOutlined className="h-3 w-3" />
                Time Limit: {maxTrainingTime.toFixed(2)} min
              </Badge>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          <EnhancedLineGraph
            valMetric={valMetric}
            data={enhancedChartData}
            loading={loading && !hasChartData}
            maxTrainingTime={maxTrainingTime}
          />

          <div className="my-5">
            <TrainingInfoMetrics
              valMetric={valMetric}
              experimentName={
                experimentName === "loading"
                  ? "Finding Instance..."
                  : experimentName
              }
              trainingInfo={trainingInfo}
              elapsedTime={elapsedTime}
              status={status}
            />
          </div>

          <Alert className="rounded-xl border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-slate-800">
            <AlertDescription>
              <div>
                <p className="!m-0">
                  <RadarChartOutlined className="mr-2 inline h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <strong className="text-gray-900 dark:text-white">
                    Understand Metrics:
                  </strong>{" "}
                  <span className="text-gray-700 dark:text-gray-300">
                    {metricExplain}
                  </span>
                </p>

                {maxTrainingTime && (
                  <p className="mt-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center">
                          <HourglassOutlined className="mr-2 h-4 w-4 text-amber-500" />
                          <strong className="text-gray-900 dark:text-white">
                            Training Time Limit:
                          </strong>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Time constraints can affect model performance
                      </TooltipContent>
                    </Tooltip>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      This experiment has a maximum training time of{" "}
                      {maxTrainingTime.toFixed(2)} minutes. If the training
                      doesn't converge within this time, consider adjusting
                      model complexity or training parameters.
                    </span>
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
