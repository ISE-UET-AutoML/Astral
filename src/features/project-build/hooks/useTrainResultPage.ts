import * as React from "react";
import { toast } from "sonner";
import * as experimentAPI from "src/features/project-build/api/experiment";
import * as mlServiceAPI from "src/features/project-build/api/mlService";
import * as experimentConfigAPI from "src/features/project-build/api/experiment_config";

const { useEffect, useState } = React;

const normalizeMetricSeries = (series, epochs = []) => {
  if (Array.isArray(series)) {
    return series.map((point, index) => {
      if (point && typeof point === "object") {
        return {
          step: point.step ?? point.epoch ?? epochs[index] ?? index + 1,
          value: point.value ?? point.score ?? point.y,
        };
      }

      return {
        step: epochs[index] ?? index + 1,
        value: point,
      };
    });
  }

  if (series && typeof series === "object") {
    return Object.entries(series).map(([step, value]) => ({
      step: Number.isNaN(Number(step)) ? step : Number(step),
      value,
    }));
  }

  return [];
};

export const useTrainResultPage = ({
  experimentId,
  experimentName,
  projectId,
}) => {
  const [experiment, setExperiment] = useState({});
  const [metrics, setMetrics] = useState([]);
  const [valGraphs, setValGraphs] = useState({});
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    if (!experimentId) return;

    const fetchExperiment = async () => {
      try {
        const experimentRes =
          await experimentAPI.getExperimentById(experimentId);
        if (experimentRes.status !== 200) {
          throw new Error("Cannot get experiment");
        }
        setExperiment(experimentRes.data);
      } catch (error) {
        console.error("Error while getting experiment", error);
      }
    };

    const fetchExperimentConfig = async () => {
      try {
        const experimentConfigRes =
          await experimentConfigAPI.getExperimentConfig(experimentId);
        if (experimentConfigRes.status !== 200) {
          throw new Error("Cannot get experiment config");
        }
        const history = experimentConfigRes.data[0].metrics.training_history;
        setEpoch(history ? history.length : 0);
      } catch (error) {
        console.error("Error while getting experiment config", error);
      }
    };

    const fetchExperimentMetrics = async () => {
      setMetrics([]);
      try {
        const metricsRes = await mlServiceAPI.getFinalMetrics(experimentId);
        if (metricsRes.status !== 200) {
          throw new Error("Cannot get metrics");
        }

        const nextMetrics = Object.keys(metricsRes.data).map((key) => {
          const metric = metricsRes.data[key];
          return {
            key,
            metric: metric.name,
            value: metric.score,
            description: metric.description,
          };
        });
        setMetrics(nextMetrics);
      } catch (error) {
        console.error("Error while getting metrics", error);
      }
    };

    const fetchTrainingHistory = async () => {
      try {
        const res = await mlServiceAPI.getFitHistory(projectId, experimentName);
        const data = res.data;

        if (data.error) {
          toast.error("An error occurred while fetching the training history.");
          return;
        }

        const graphs = {};
        const epochs = Array.isArray(data.epoch) ? data.epoch : [];
        for (const key of Object.keys(data)) {
          if (key === "epoch") continue;
          graphs[key] = normalizeMetricSeries(data[key], epochs);
        }
        setValGraphs(graphs);
      } catch (error) {
        console.error("Error fetching training history:", error);
        toast.error("Failed to load training history. Please try again later.");
      }
    };

    fetchExperiment();
    fetchExperimentMetrics();
    fetchTrainingHistory();
    fetchExperimentConfig();
  }, [experimentId, experimentName, projectId]);

  return {
    experiment,
    metrics,
    valGraphs,
    isDetailsExpanded,
    setIsDetailsExpanded,
    epoch,
  };
};
