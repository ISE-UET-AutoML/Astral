import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { History, Download, BarChart3, ArrowRight } from "lucide-react";
import * as modelServiceAPI from "src/features/models/api/model";
import { PATHS } from "src/constants/paths";
import { useTrainResultPage } from "src/features/project-build/hooks/useTrainResultPage";
import { TrainResultSummaryCards } from "src/features/project-build/components/training/TrainResultSummaryCards";
import { TrainResultPerformanceCharts } from "src/features/project-build/components/training/TrainResultPerformanceCharts";
import { TrainResultMetricsTable } from "src/features/project-build/components/training/TrainResultMetricsTable";
import { PageHeading } from "src/layouts/page-heading";
import { projectPageShellClass } from "src/shared/hooks/project-page-shell";

const TrainResult = () => {
  const { projectInfo } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const experimentName = searchParams.get("experimentName");
  const experimentId = searchParams.get("experimentId");

  const {
    experiment,
    metrics,
    valGraphs,
    isDetailsExpanded,
    setIsDetailsExpanded,
    epoch,
  } = useTrainResultPage({
    experimentId,
    experimentName,
    projectId: projectInfo.id,
  });

  return (
    <div className={projectPageShellClass}>
      <div className="mb-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <PageHeading
            className="mb-0 min-w-0 flex-1"
            icon={BarChart3}
            title="Training Result"
            description="Review the performance metrics and results from your training experiment."
          />
          <button
            type="button"
            onClick={async () => {
              const modelRes =
                await modelServiceAPI.getModelByExperimentId(experimentId);
              navigate(PATHS.MODEL_VIEW(projectInfo.id, modelRes.data.id));
            }}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400 lg:mt-1"
          >
            View Model
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>

        <TrainResultSummaryCards
          metrics={metrics}
          experiment={experiment}
          epoch={epoch}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <button
            type="button"
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="flex w-full items-center gap-2 rounded-t-2xl px-6 py-4 text-left font-semibold text-gray-900 transition hover:bg-gray-100/50 dark:text-white dark:hover:bg-white/10"
          >
            <History className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            {isDetailsExpanded ? "Hide Details" : "Show Detailed Results"}
          </button>

          {isDetailsExpanded && (
            <div className="flex flex-col gap-6 border-t border-gray-200 px-6 py-6 dark:border-white/10">
              <TrainResultPerformanceCharts valGraphs={valGraphs} />
              <TrainResultMetricsTable metrics={metrics} />
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
                <div className="flex gap-3">
                  <Download className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Export Metrics
                    </p>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                      You can export these metrics and training history data for
                      offline analysis or reporting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainResult;
