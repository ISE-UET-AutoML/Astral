import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { History, Download, Rocket, BarChart3 } from "lucide-react";
import * as modelServiceAPI from "src/features/models/api/model";
import { PATHS } from "src/constants/paths";
import { useTrainResultPage } from "src/features/project-build/hooks/useTrainResultPage";
import { TrainResultSummaryCards } from "src/features/project-build/components/training/TrainResultSummaryCards";
import { TrainResultPerformanceCharts } from "src/features/project-build/components/training/TrainResultPerformanceCharts";
import { TrainResultMetricsTable } from "src/features/project-build/components/training/TrainResultMetricsTable";

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
    <div className="min-h-screen overflow-y-auto bg-white dark:bg-slate-950">
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Training Result
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Review the performance metrics and results from your training
            experiment.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6">
          {/* Summary Cards */}
          <TrainResultSummaryCards
            metrics={metrics}
            experiment={experiment}
            epoch={epoch}
          />

          {/* View Model Button */}
          <div className="flex justify-center">
            <button
              onClick={async () => {
                const modelRes =
                  await modelServiceAPI.getModelByExperimentId(experimentId);
                navigate(PATHS.MODEL_VIEW(projectInfo.id, modelRes.data.id));
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
            >
              <Rocket className="w-4 h-4" />
              View Model
            </button>
          </div>

          {/* Detailed Results Section */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="flex w-full items-center gap-2 px-6 py-4 text-left font-semibold text-gray-900 dark:text-white transition hover:bg-gray-100/50 dark:hover:bg-white/10 rounded-t-2xl"
            >
              <History className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              {isDetailsExpanded ? "Hide Details" : "Show Detailed Results"}
            </button>

            {isDetailsExpanded && (
              <div className="border-t border-gray-200 dark:border-white/10 px-6 py-6 flex flex-col gap-6">
                <TrainResultPerformanceCharts valGraphs={valGraphs} />
                <TrainResultMetricsTable metrics={metrics} />
                <div className="rounded-xl border border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20 p-4">
                  <div className="flex gap-3">
                    <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                        Export Metrics
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        You can export these metrics and training history data
                        for offline analysis or reporting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainResult;
