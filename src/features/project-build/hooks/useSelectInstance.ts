import * as React from "react";
import { toast } from "sonner";
import { retrainCloudModel, trainCloudModel } from "src/features/project-build/api/mlService";
import { createDownZipPU } from "src/features/datasets/api/dataset";
import {
  SERVICES,
  GPU_LEVELS,
  generateRandomKey,
} from "src/constants/clouldInstance";

const { useState, useEffect } = React;

export const useSelectInstance = ({
  projectInfo,
  selectedProject,
  updateFields,
  navigate,
  trainingTags = ["autogluon"],
}) => {
  const selectedTrainingTags =
    Array.isArray(trainingTags) && trainingTags.length > 0
      ? trainingTags
      : ["autogluon"];
  const [activeTab, setActiveTab] = useState("automatic");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    service: SERVICES[0].name,
    gpuNumber: GPU_LEVELS[0].gpuNumber,
    gpuName: GPU_LEVELS[0].name,
    disk: GPU_LEVELS[0].disk,
    trainingTime: 2,
    budget: (GPU_LEVELS[0].cost * 2).toFixed(2),
    cost: GPU_LEVELS[0].cost,
    instanceSize: "Weak",
  });
  const [instanceInfo, setInstanceInfo] = useState(null);
  const [sshKey, setSshKey] = useState("");
  const [infrastructureData, setInfrastructureData] = useState({
    id: "",
    sshPort: "",
    publicIP: "",
    presets: "medium_quality",
    deployPort: "",
    username: "",
    datasetPath: "./datasets/tabular",
  });

  // Generate SSH key when switching to userInfras tab
  useEffect(() => {
    if (activeTab === "userInfras" && !sshKey) {
      const generatedKey = generateRandomKey();
      setSshKey(generatedKey);
    }
  }, [activeTab, sshKey]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sshKey);
    toast.success("SSH Key copied to clipboard");
  };

  const handleInfrastructureChange = (field) => (value) => {
    setInfrastructureData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTrainingTimeChange = (value) => {
    if (value >= 0 && value <= 24) {
      setFormData((prev) => ({
        ...prev,
        trainingTime: value,
      }));
    }
  };

  const handleGpuNumberChange = (value) => {
    if (value >= 1 && value <= 8) {
      setFormData((prev) => ({
        ...prev,
        gpuNumber: value,
      }));
    }
  };

  const handleDiskChange = (value) => {
    if (value >= 10 && value <= 1000) {
      setFormData((prev) => ({
        ...prev,
        disk: value,
      }));
    }
  };

  const handleManualConfigChange = (field) => (value) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === "gpuName" || field === "trainingTime") {
        const gpuName = field === "gpuName" ? value : prev.gpuName;
        const trainingTime =
          field === "trainingTime" ? value : prev.trainingTime;
        const selectedGPU = GPU_LEVELS.find((gpu) => gpu.name === gpuName);

        if (selectedGPU && trainingTime) {
          next.budget = (selectedGPU.cost * trainingTime).toFixed(2);
        }
      }

      return next;
    });
  };

  const getAutomaticGpuConfig = () => {
    const instanceSize = formData.instanceSize;
    let selectedGPU;

    switch (instanceSize) {
      case "Weak":
        selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 1);
        break;
      case "Medium":
        selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 2);
        break;
      case "Strong":
        selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 4);
        break;
      case "Super Strong":
        selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 6);
        break;
      case "Rocket":
        selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 8);
        break;
      default:
        selectedGPU = GPU_LEVELS[0];
        break;
    }

    return selectedGPU;
  };

  const buildSharedTrainingPayload = async () => {
    const selectedGPU = getAutomaticGpuConfig();

    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormData((prev) => ({
      ...prev,
      service: SERVICES[0].name,
      gpuNumber: selectedGPU.gpuNumber,
      gpuName: selectedGPU.name,
      disk: selectedGPU.disk,
      budget: (selectedGPU.cost * formData.trainingTime).toFixed(2),
      cost: selectedGPU.cost,
    }));

    const presignUrl = await createDownZipPU(selectedProject.dataset_id);
    return {
      cost: selectedGPU.cost * formData.trainingTime,
      trainingTime: formData.trainingTime * 3600,
      presets: "medium_quality",
      trainDataId: selectedProject.dataset_id,
      datasetUrl: presignUrl.data,
      datasetLabelUrl: "hello",
      problemType: selectedProject.meta_data?.is_binary_class
        ? "BINARY"
        : "MULTICLASS",
      framework: "autogluon",
      datasetMetadata: selectedProject.meta_data,
    };
  };

  const buildRetrainPayload = async () => {
    const selectedGPU = getAutomaticGpuConfig();

    await new Promise((resolve) => setTimeout(resolve, 500));
    setFormData((prev) => ({
      ...prev,
      service: SERVICES[0].name,
      gpuNumber: selectedGPU.gpuNumber,
      gpuName: selectedGPU.name,
      disk: selectedGPU.disk,
      budget: (selectedGPU.cost * formData.trainingTime).toFixed(2),
      cost: selectedGPU.cost,
    }));

    const presignUrl = await createDownZipPU(selectedProject.dataset_id);
    return {
      cost: selectedGPU.cost * formData.trainingTime,
      trainingTime: formData.trainingTime * 3600,
      presets: "medium_quality",
      trainDataId: selectedProject.dataset_id,
      datasetUrl: presignUrl.data,
      sourceVersion: selectedProject.meta_data?.source_version || null,
    };
  };

  const launchAutomaticTrainingRuns = async () => {
    const sharedPayload = await buildSharedTrainingPayload();

    // TODO: replace this shared automatic-config fan-out with per-method instance configuration.
    const pendingRuns = selectedTrainingTags.map(async (tag) => {
      const response = await trainCloudModel(projectInfo.id, {
        ...sharedPayload,
        tag,
      });
      return { tag, ...response.data };
    });

    const results = await Promise.allSettled(pendingRuns);

    return results.reduce(
      (acc, result, index) => {
        if (result.status === "fulfilled") {
          acc.successes.push(result.value);
        } else {
          acc.failures.push({
            tag: selectedTrainingTags[index],
            error: result.reason,
          });
        }
        return acc;
      },
      { successes: [], failures: [] },
    );
  };

  const buildTrainingQuery = (experiments) => {
    const params = new URLSearchParams();
    params.set("experiments", JSON.stringify(experiments));

    if (experiments.length === 1 && experiments[0]?.type !== "retrain") {
      params.set("experimentId", experiments[0].experimentId);
      params.set("experimentName", experiments[0].experimentName);
    }

    return params.toString();
  };

  // Find instance and train model sequentially
  const handleStartTraining = async () => {
    if (!formData.trainingTime) {
      toast.error("Please input training time");
      return;
    }

    if (selectedTrainingTags.length === 0) {
      toast.error("Please choose at least one training method.");
      return;
    }

    if (!selectedProject || !selectedProject.dataset_id) {
      toast.error(
        "Dataset is missing for this project. Please go back and select a label project again.",
      );
      return;
    }

    const retrainModelId =
      selectedProject.meta_data?.model_id || selectedProject.model_id;
    const isRetraining = Boolean(
      selectedProject.meta_data?.source === "drift_recommendation" &&
        retrainModelId,
    );

    if (isRetraining) {
      setIsProcessing(true);
      const loadingRetrain = [
        {
          tag: "retrain",
          type: "retrain",
          experimentId: "loading",
          experimentName: "Preparing retraining",
        },
      ];

      navigate(
        `/app/project/${projectInfo.id}/build/training?${buildTrainingQuery(loadingRetrain)}`,
        { replace: true },
      );

      try {
        const payload = await buildRetrainPayload();
        const response = await retrainCloudModel(
          projectInfo.id,
          retrainModelId,
          payload,
        );
        const retrainJob = response.data;
        if (!retrainJob.model_version_id) {
          throw new Error(
            "Retrain response is missing model_version_id. Restart backend-gateway and ml-service, then try again.",
          );
        }

        const retrainProgress = [
          {
            tag: "retrain",
            type: "retrain",
            modelId: retrainModelId,
            modelVersionId: retrainJob.model_version_id,
            newVersion: retrainJob.new_version,
            experimentId: retrainJob.experiment_id,
            experimentName:
              retrainJob.experiment_name ||
              selectedProject.meta_data?.experiment_name ||
              "Retraining",
          },
        ];

        navigate(
          `/app/project/${projectInfo.id}/build/training?${buildTrainingQuery(retrainProgress)}`,
          { replace: true },
        );
      } catch (error) {
        console.error("Retraining error", error);
        toast.error(
          error.response?.data?.error ||
            error.response?.data?.detail ||
            "Failed to start retraining.",
        );
        navigate(`/app/project/${projectInfo.id}/build/selectInstance`, {
          replace: true,
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setIsProcessing(true);

    const loadingExperiments = selectedTrainingTags.map((tag) => ({
      tag,
      experimentId: "loading",
      experimentName: "loading",
    }));

    navigate(
      `/app/project/${projectInfo.id}/build/training?${buildTrainingQuery(loadingExperiments)}`,
      { replace: true },
    );

    try {
      const launchResult = await launchAutomaticTrainingRuns();

      if (launchResult.failures.length > 0) {
        toast.warning(
          `Some runs failed to start: ${launchResult.failures
            .map((item) => String(item.tag).toUpperCase())
            .join(", ")}`,
        );
      }

      const experiments = launchResult.successes
        .filter((item) => item && item.experimentName && item.experimentId)
        .map((item) => ({
          tag: item.tag,
          experimentId: item.experimentId,
          experimentName: item.experimentName,
        }));

      if (experiments.length > 0) {
        const pid = projectInfo.id ?? projectInfo._id;
        if (pid) {
          try {
            sessionStorage.removeItem(`astral:build:draft:${pid}`);
          } catch (_) {
            /* ignore */
          }
        }

        navigate(
          `/app/project/${projectInfo.id}/build/training?${buildTrainingQuery(experiments)}`,
          { replace: true },
        );
      } else {
        toast.error("Training result is invalid!");
        navigate(`/app/project/${projectInfo.id}/build/selectInstance`, {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Failed to find instance or train model.");
      navigate(`/app/project/${projectInfo.id}/build/selectInstance`, {
        replace: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    // state
    activeTab,
    setActiveTab,
    isLoading,
    setIsLoading,
    isCreatingInstance,
    setIsCreatingInstance,
    isProcessing,
    formData,
    setFormData,
    instanceInfo,
    setInstanceInfo,
    sshKey,
    setSshKey,
    infrastructureData,
    setInfrastructureData,
    // handlers
    handleCopyToClipboard,
    handleInfrastructureChange,
    handleTrainingTimeChange,
    handleGpuNumberChange,
    handleDiskChange,
    handleManualConfigChange,
    handleStartTraining,
  };
};
