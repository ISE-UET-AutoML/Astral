import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { Badge } from "src/components/ui/badge";
import { Spinner } from "src/components/ui/spinner";
import { useSpring, animated } from "@react-spring/web";
import { PATHS } from "src/constants/paths";
import { useTrainingPage } from "src/features/project-build/hooks/useTrainingPage";
import { TrainingProgressSteps } from "src/features/project-build/components/training/TrainingProgressSteps";
import { TrainingCharts } from "src/features/project-build/components/training/TrainingCharts";
import React from "react";

const parseExperiments = (searchParams) => {
  const experimentId = searchParams.get("experimentId");
  const experimentName = searchParams.get("experimentName") || "loading";
  const rawExperiments = searchParams.get("experiments");

  if (rawExperiments) {
    try {
      const parsed = JSON.parse(rawExperiments);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (error) {
      console.warn("Failed to parse experiments query param", error);
    }
  }

  if (experimentId) return [{ experimentId, experimentName }];
  return [];
};

const Training = () => {
  const { projectInfo } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();
  const experiments = React.useMemo(
    () => parseExperiments(new URLSearchParams(location.search)),
    [location.search],
  );
  const { experimentCards, primaryExperiment, loading, settingUpProgress } =
    useTrainingPage({ experiments });
  const metricExplain = projectInfo.metrics_explain;
  const isSingleExperiment = experimentCards.length <= 1;

  const handleViewResults = (experiment) => {
    navigate(
      PATHS.PROJECT_TRAININGRESULT(
        projectInfo.id,
        experiment.experimentId,
        experiment.experimentName,
      ),
    );
  };

  return (
    <div className="w-full px-6 py-8">
      <animated.div
        style={useSpring({
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
          config: { tension: 280, friction: 22 },
        })}
      >
        <div className="flex flex-col gap-6">
          {/* Experiment progress cards */}
          {experimentCards.map((experiment) => (
            <div
              key={`${experiment.tag || "default"}-${experiment.experimentId}`}
              className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900"
            >
              {experiment.tag && (
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-6 py-4 dark:border-white/10">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    {experiment.experimentName === "loading"
                      ? `Preparing ${String(experiment.tag || "training").toUpperCase()}`
                      : experiment.experimentName}
                  </h2>
                  <Badge
                    variant="outline"
                    className="h-6 rounded-full px-2.5 text-xs font-medium"
                  >
                    {experiment.tag}
                  </Badge>
                </div>
              )}
              <div className="p-6">
                <TrainingProgressSteps
                  currentStep={experiment.currentStep}
                  status={experiment.status}
                  experimentName={experiment.experimentName}
                  maxTrainingTime={experiment.maxTrainingTime}
                  elapsedTime={experiment.elapsedTime}
                  onViewResults={() => handleViewResults(experiment)}
                  currentSettingUpStep={experiment.currentSettingUpStep}
                  settingUpProgress={settingUpProgress}
                />
              </div>
            </div>
          ))}

          {/* Loading placeholder */}
          {loading && experimentCards.length === 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
              <Spinner className="size-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Preparing training status…
              </p>
            </div>
          )}

          {/* Charts — single experiment only, once training is underway */}
          {isSingleExperiment &&
            primaryExperiment &&
            primaryExperiment.currentStep >= 3 && (
              <TrainingCharts
                currentStep={primaryExperiment.currentStep}
                valMetric={primaryExperiment.valMetric}
                maxTrainingTime={primaryExperiment.maxTrainingTime}
                enhancedChartData={primaryExperiment.enhancedChartData}
                loading={loading}
                hasChartData={primaryExperiment.chartData?.length > 0}
                experimentId={primaryExperiment.experimentId}
                experimentName={primaryExperiment.experimentName}
                trainingInfo={primaryExperiment.trainingInfo}
                elapsedTime={primaryExperiment.elapsedTime}
                status={primaryExperiment.status}
                onViewResults={() => handleViewResults(primaryExperiment)}
                trainProgress={primaryExperiment.trainProgress}
                metricExplain={metricExplain}
              />
            )}
        </div>
      </animated.div>
    </div>
  );
};

export default Training;
