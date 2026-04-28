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
      <Card className="rounded-xl border border-[var(--border)] bg-[var(--card-gradient)] font-poppins shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="m-0 flex items-center text-xl font-semibold text-[var(--text)]">
              <LineChartOutlined className="mr-2 text-[var(--accent-text)]" />
              {`${valMetric ? valMetric : "Accuracy"} Trend`}
            </CardTitle>
            {maxTrainingTime ? (
              <Badge className="border-none bg-gradient-to-br from-[#f59e0b] to-[#f97316] font-poppins text-white">
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

          <Alert className="rounded-xl border border-[rgba(59,130,246,0.3)] bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(34,211,238,0.1))] font-poppins">
            <AlertDescription>
              <div>
                <p className="!m-0 font-poppins">
                  <RadarChartOutlined className="mr-2 inline h-4 w-4 text-[#60a5fa]" />
                  <strong className="font-poppins text-[var(--text)]">
                    Understand Metrics:
                  </strong>{" "}
                  <span className="font-poppins text-[var(--text)]">
                    {metricExplain}
                  </span>
                </p>

                {maxTrainingTime && (
                  <p className="mt-3 font-poppins">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center">
                          <HourglassOutlined className="mr-2 h-4 w-4 text-[#f59e0b]" />
                          <strong className="font-poppins text-[var(--text)]">
                            Training Time Limit:
                          </strong>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Time constraints can affect model performance
                      </TooltipContent>
                    </Tooltip>{" "}
                    <span className="font-poppins text-[var(--text)]">
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
