import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "src/components/ui/button";
import { Spinner } from "src/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "src/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { toast } from "sonner";
import {
  Download as DownloadOutlined,
  Settings as SettingOutlined,
  ArrowLeft as ArrowLeftOutlined,
  Rocket as RocketOutlined,
} from "lucide-react";
import { getProjectById } from "src/features/projects/api/project";
import { getModelById } from "src/features/models/api/model";
import {
  getLbProjByTask,
  startExport,
  getExportStatus,
} from "src/features/labels/api/labelProject";
import * as dataServiceAPI from "src/features/datasets/api/dataset";
import { formatDistanceToNow, format } from "date-fns";
import axios from "axios";
import Papa from "papaparse";
import ImageHistoryViewer from "src/features/models/components/ImageHistoryViewer";
import TextHistoryViewer from "src/features/models/components/TextHistoryViewer";
import MultilabelHistoryViewer from "src/features/models/components/MultilabelHistoryViewer";
import { API_BASE_URL } from "src/constants/api";
import instance from "src/api/axios";

const getToastContent = (value) =>
  typeof value === "object" && value?.content ? value.content : value;
const message = {
  success: (value) => toast.success(getToastContent(value)),
  error: (value) => toast.error(getToastContent(value)),
  warning: (value) => toast.warning(getToastContent(value)),
  info: (value) => toast.info(getToastContent(value)),
  loading: (value) => toast.loading(getToastContent(value)),
};

const AuthenticatedImage = ({ src, alt, className = "" }) => {
  const [objectUrl, setObjectUrl] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    let nextObjectUrl = "";

    const loadImage = async () => {
      setStatus("loading");
      setObjectUrl("");
      try {
        const response = await instance.get(src, { responseType: "blob" });
        nextObjectUrl = URL.createObjectURL(response.data);
        if (isMounted) {
          setObjectUrl(nextObjectUrl);
          setStatus("loaded");
        }
      } catch (error) {
        console.error("Failed to load authenticated image:", src, error);
        if (isMounted) setStatus("error");
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (nextObjectUrl) URL.revokeObjectURL(nextObjectUrl);
    };
  }, [src]);

  if (status === "loaded" && objectUrl) {
    return <img src={objectUrl} alt={alt} className={className} />;
  }

  return (
    <div
      className={`${className} flex items-center justify-center border border-dashed border-white/10 bg-black/20 text-xs text-gray-400`}
    >
      {status === "loading" ? "Loading preview..." : "Preview unavailable"}
    </div>
  );
};

export default function RecentPredictionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id, modelId } = useParams();
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [projectInfo, setProjectInfo] = useState({});
  const [model, setModel] = useState(null);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedPredictions, setSelectedPredictions] = useState([]);
  const [isDatasetModalVisible, setIsDatasetModalVisible] = useState(false);
  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
  const [selectedDatasetKeys, setSelectedDatasetKeys] = useState([]);
  const [driftRecommendation, setDriftRecommendation] = useState(null);
  const [driftRecommendationError, setDriftRecommendationError] = useState("");
  const [isLoadingDriftRecommendation, setIsLoadingDriftRecommendation] =
    useState(false);
  const [selectedDriftImages, setSelectedDriftImages] = useState([]);
  const [isStartingRecommendedRetrain, setIsStartingRecommendedRetrain] =
    useState(false);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isJsonLoading, setIsJsonLoading] = useState(false);
  const [selectedPredictionContent, setSelectedPredictionContent] =
    useState(null);

  const simpleDataModalRef = useRef(null);
  const multilabelModalRef = useRef(null);

  const fetchModelData = useCallback(async () => {
    if (!modelId) return;
    try {
      const res = await getModelById(modelId);
      setModel(res.data);
    } catch (error) {
      console.error("Error fetching model data:", error);
    }
  }, [modelId]);

  const fetchProjectData = useCallback(async () => {
    if (!id) return;
    try {
      const { data } = await getProjectById(id);
      setProjectInfo(data.project);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchModelData();
    fetchProjectData();
  }, [fetchModelData, fetchProjectData]);

  useEffect(() => {
    if (!modelId || searchParams.get("source") !== "drift") return;

    const fetchDriftRecommendation = async () => {
      setIsLoadingDriftRecommendation(true);
      setDriftRecommendationError("");
      try {
        const response = await dataServiceAPI.getDriftRecommendation(modelId);
        const recommendation = response.data;
        setDriftRecommendation(recommendation);
        setSelectedDriftImages(
          (recommendation.images || [])
            .filter((image) => image.hasLabel)
            .map((image) => image.fileName),
        );
      } catch (error) {
        console.error("Failed to fetch drift recommendation:", error);
        setDriftRecommendation(null);
        setDriftRecommendationError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Failed to load drift recommendation.",
        );
        message.error("Failed to load drift recommendation.");
      } finally {
        setIsLoadingDriftRecommendation(false);
      }
    };

    fetchDriftRecommendation();
  }, [modelId, searchParams]);

  useEffect(() => {
    if (!model?.id) return;

    const fetchRecentPredictions = async () => {
      setIsLoadingPredictions(true);
      try {
        const response = await dataServiceAPI.getAllDeployData(model.id);
        if (response.status === 200) {
          setRecentPredictions(response.data.deploy_data);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setRecentPredictions([]);
        } else {
          console.error("Can't fetch recent predictions:", error);
        }
      } finally {
        setIsLoadingPredictions(false);
      }
    };

    fetchRecentPredictions();
  }, [model]);

  const handleViewPrediction = async (prediction) => {
    setIsModalVisible(true);
    setIsJsonLoading(true);
    setSelectedPredictionContent(null);

    try {
      const s3_key = prediction.predict_data_url;
      const downloadJsonContentPresignedUrl =
        await dataServiceAPI.createDownPresignedUrls(s3_key);

      if (!downloadJsonContentPresignedUrl) {
        throw new Error("Không nhận được Presigned URL.");
      }

      const predictUrl = downloadJsonContentPresignedUrl.data.url;
      // console.logs("Predict URL:", predictUrl)

      const jsonResponse = await axios.get(predictUrl);
      const predictContent = jsonResponse.data;

      try {
        const feedback_s3_key =
          prediction.predict_data_url.split("predict.")[0] + "feedback.json";
        const downloadFeedbackJsonContentPresignedUrl =
          await dataServiceAPI.createDownPresignedUrls(feedback_s3_key);

        const feedbackUrl = downloadFeedbackJsonContentPresignedUrl.data.url;
        const feedbackJsonResponse = await axios.get(feedbackUrl);
        console.log("Feedback Content:", feedbackJsonResponse.data);
      } catch (error) {
        console.warn(
          "Could not load feedback data, it might not exist yet.",
          error.message,
        );
      }

      if (projectInfo.task_type.includes("IMAGE")) {
        const imageUrlResponse = await dataServiceAPI.getPresignedUrlsForImages(
          prediction.data_url,
        );
        const imageUrl = imageUrlResponse.data.data;
        const combinedImageData = predictContent.map((item, index) => ({
          ...item,
          imageUrl: imageUrl[index],
        }));
        setSelectedPredictionContent(combinedImageData);
      } else {
        const dataUrl = prediction.data_url + prediction.file_name;
        const fileUrl = await dataServiceAPI.createDownPresignedUrls(dataUrl);
        const fileDownloadUrl = fileUrl.data.url;
        const fileContentResponse = await axios.get(fileDownloadUrl);
        const fileContent = fileContentResponse.data;
        const parsedCsv = Papa.parse(fileContent, { header: true });

        const inputData = parsedCsv.data.filter((row) =>
          Object.values(row).some((value) => value !== "" && value !== null),
        );
        const combinedData = inputData.map((row, index) => ({
          ...row,
          ...(predictContent[index] || {}),
        }));
        setSelectedPredictionContent(combinedData);
      }
    } catch (error) {
      console.error("Error fetching prediction content:", error);
      message.error("Failed to load prediction content. Please try again.");
      setSelectedPredictionContent({
        error: "Download failed.",
        details: error.message,
      });
    } finally {
      setIsJsonLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPredictionContent(null);
  };

  const handleDownloadHistory = () => {
    if (projectInfo.task_type.includes("MULTILABEL")) {
      multilabelModalRef.current?.downloadCsv();
    } else {
      simpleDataModalRef.current?.downloadCsv();
    }
  };

  const updateDriftImageLabel = (fileName, label) => {
    setDriftRecommendation((current) => {
      if (!current) return current;
      return {
        ...current,
        images: current.images.map((image) =>
          image.fileName === fileName
            ? { ...image, label, hasLabel: Boolean(label?.trim()) }
            : image,
        ),
      };
    });
  };

  const toggleDriftImage = (fileName) => {
    setSelectedDriftImages((current) =>
      current.includes(fileName)
        ? current.filter((item) => item !== fileName)
        : [...current, fileName],
    );
  };

  const handleRecommendedRetrain = async () => {
    const images = driftRecommendation?.images || [];
    const selectedImages = images
      .filter((image) => selectedDriftImages.includes(image.fileName))
      .map((image) => ({
        fileName: image.fileName,
        label: image.label,
      }))
      .filter((image) => image.fileName && image.label);

    if (selectedImages.length === 0) {
      message.warning("Select at least one labeled recommended image.");
      return;
    }

    setIsStartingRecommendedRetrain(true);
    try {
      const response = await dataServiceAPI.prepareRecommendedDriftRetrain(
        modelId,
        selectedImages,
      );
      const selectedProject = response.data.selectedProject;
      if (!selectedProject?.dataset_id) {
        throw new Error("Prepared retrain dataset is missing dataset_id.");
      }

      const trainingTags = ["autogluon"];
      try {
        sessionStorage.setItem(
          `astral:build:draft:${id}`,
          JSON.stringify({ selectedProject, trainingTags }),
        );
      } catch (storageError) {
        console.warn("Failed to save retrain draft:", storageError);
      }

      message.success({
        content: "Dataset prepared. Choose an instance to continue retraining.",
        key: "recommended-retrain",
        duration: 4,
      });
      navigate(`/app/project/${id}/build/selectInstance`, {
        state: {
          isRetraining: true,
          previousModelId: modelId,
          datasetId: selectedProject.dataset_id,
          retrainDatasetId: selectedProject.dataset_id,
          selectedProject,
          trainingTags,
          source: "drift_recommendation",
        },
      });
    } catch (error) {
      console.error("Failed to start recommended retrain:", error);
      message.error({
        content:
          error.response?.data?.detail ||
          error.message ||
          "Failed to start retraining.",
        key: "recommended-retrain",
        duration: 5,
      });
    } finally {
      setIsStartingRecommendedRetrain(false);
    }
  };

  const handleRetrain = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning(
        "Please select at least one prediction history to retrain.",
      );
      return;
    }

    setIsDatasetModalVisible(true);
    setIsLoadingDatasets(true);
    setSelectedDatasetKeys([]); // Reset selection

    try {
      const lbProjectsRes = await getLbProjByTask(projectInfo.task_type);
      setAvailableDatasets(lbProjectsRes.data || []);
    } catch (error) {
      console.error("Failed to fetch datasets:", error);
      message.error("Failed to load available datasets.");
    } finally {
      setIsLoadingDatasets(false);
    }
  };

  const pollExportStatus = (taskId) => {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const response = await getExportStatus(taskId);
          // Kiểm tra cấu trúc response dựa trên UploadData.jsx
          const { status, result, error } = response.data;

          console.log(`[pollExportStatus] Task ${taskId} → status: ${status}`);

          if (status === "SUCCESS") {
            clearInterval(intervalId);
            resolve(result);
          } else if (status === "FAILURE") {
            clearInterval(intervalId);
            reject(new Error(error || "Export task failed."));
          }
          // Nếu status là PENDING hoặc khác thì tiếp tục chờ
        } catch (err) {
          clearInterval(intervalId);
          console.error(
            `[pollExportStatus] Error checking task ${taskId}:`,
            err?.message || err,
          );
          reject(err);
        }
      }, 2000); // Kiểm tra mỗi 2 giây
    });
  };

  const confirmRetrain = async () => {
    if (selectedDatasetKeys.length === 0) {
      message.warning("Please select a base dataset.");
      return;
    }

    const selectedDatasetId = selectedDatasetKeys[0];
    const selectedProject = availableDatasets.find(
      (p) => p.id === selectedDatasetId,
    );

    if (!selectedProject) {
      message.error("Selected project not found.");
      return;
    }

    setIsRetraining(true);
    message.loading({
      content: "Initiating retraining process...",
      key: "retrain",
    });

    try {
      const payload = {
        project_id: id,
        task_type: projectInfo.task_type,
        model_id: modelId,
        original_dataset_id: selectedProject.dataset_id,
        predictions: selectedPredictions,
      };

      console.log("Recent prediction: ", selectedPredictions);

      const retrainingDataset =
        await dataServiceAPI.createRetrainingDataset(payload);
      console.log("Retraining dataset response:", retrainingDataset);
      const lsProject = retrainingDataset.data.ls_project;
      const lsProjectId = retrainingDataset.data.ls_project.label_studio_id;
      const newDatasetId = retrainingDataset.data.dataset.id;

      // start export data
      if (!lsProjectId) {
        throw new Error(
          "Could not retrieve Label Studio Project ID from response.",
        );
      }

      message.loading({
        content: "Exporting dataset for training...",
        key: "retrain",
      });
      const startResponse = await startExport(lsProjectId);
      const { task_id } = startResponse.data;

      if (!task_id) {
        throw new Error("Failed to start export task.");
      }

      console.log("Export started, task ID:", task_id);

      // 3. Polling kiểm tra trạng thái Export
      await pollExportStatus(task_id);
      message.success({
        content: "Dataset prepared successfully!",
        key: "retrain",
        duration: 3,
      });
      setIsDatasetModalVisible(false);
      navigate(`/app/project/${id}/build/selectInstance`, {
        state: {
          isRetraining: true,
          previousModelId: modelId,
          metadata: lsProject.meta_data,
          datasetId: newDatasetId,
          retrainDatasetId: newDatasetId,
        },
      });

      message.success({
        content: "Dataset prepared successfully!",
        key: "retrain",
        duration: 3,
      });
      setIsDatasetModalVisible(false);

      message.success({
        content: "Retraining dataset created successfully!",
        key: "retrain",
        duration: 3,
      });
      setIsDatasetModalVisible(false);
    } catch (error) {
      console.error("Retraining failed:", error);
      message.error({
        content:
          error.response?.data?.error ||
          error.message ||
          "Failed to start retraining.",
        key: "retrain",
        duration: 5,
      });
    } finally {
      setIsRetraining(false);
    }
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedPredictions(newSelectedRows);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="h-9 rounded-xl border-gray-200 bg-white px-4 text-sm text-gray-700 hover:bg-gray-50 dark:border-white/15 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <ArrowLeftOutlined className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Retrain Model — Recent Predictions
            </h1>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
            {searchParams.get("source") === "drift" && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-gray-900 dark:border-blue-500/30 dark:bg-blue-950/30 dark:text-white">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="m-0 text-base font-semibold">
                      Recommended Drift Images
                    </h4>
                    <p className="m-0 text-sm text-gray-600 dark:text-gray-300">
                      Review system-recommended images, adjust labels if needed,
                      then start retraining.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleRecommendedRetrain}
                    disabled={
                      selectedDriftImages.length === 0 ||
                      isStartingRecommendedRetrain
                    }
                    className="h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
                  >
                    {isStartingRecommendedRetrain && (
                      <Spinner className="mr-2" />
                    )}
                    <RocketOutlined className="mr-1.5 h-4 w-4" />
                    Retrain Recommended ({selectedDriftImages.length})
                  </Button>
                </div>

                {isLoadingDriftRecommendation ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Spinner className="h-4 w-4" />
                    Loading recommendation...
                  </div>
                ) : driftRecommendation ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {(driftRecommendation.images || []).map((image) => {
                        const checked = selectedDriftImages.includes(
                          image.fileName,
                        );
                        const imageUrl = image.imageUrl?.startsWith("http")
                          ? image.imageUrl
                          : `${API_BASE_URL}${image.imageUrl}`;
                        return (
                          <div
                            key={image.fileName}
                            className={`rounded-xl border p-3 transition ${checked ? "border-blue-500 bg-blue-50 dark:border-blue-600/60 dark:bg-blue-900/20" : "border-gray-200 bg-white dark:border-white/10 dark:bg-slate-800"}`}
                          >
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleDriftImage(image.fileName)
                                }
                              />
                              <span className="truncate">{image.fileName}</span>
                            </label>
                            <AuthenticatedImage
                              src={imageUrl}
                              alt={image.fileName}
                              className="mb-2 h-32 w-full rounded-md object-cover"
                            />
                            <input
                              value={image.label || ""}
                              onChange={(event) =>
                                updateDriftImageLabel(
                                  image.fileName,
                                  event.target.value,
                                )
                              }
                              placeholder="Label"
                              className="h-9 w-full rounded-xl border border-gray-200 bg-white px-3 py-1 text-sm text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="m-0 text-sm text-gray-600 dark:text-gray-300">
                    {driftRecommendationError || "No recommendation loaded."}
                  </p>
                )}
              </div>
            )}

            <div className="mb-4 flex justify-end">
              <Button
                type="button"
                onClick={handleRetrain}
                disabled={selectedRowKeys.length === 0 || isRetraining}
                className="h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                {isRetraining && <Spinner className="mr-2" />}
                <RocketOutlined className="mr-1.5 h-4 w-4" />
                Retrain with Selected ({selectedRowKeys.length})
              </Button>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-white/10">
              {isLoadingPredictions ? (
                <div className="flex min-h-40 items-center justify-center">
                  <Spinner className="h-6 w-6" />
                </div>
              ) : recentPredictions.length === 0 ? (
                <div className="flex min-h-40 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  No prediction history yet.
                </div>
              ) : (
                <Table className="text-sm">
                  <TableHeader className="bg-gray-50 dark:bg-white/5">
                    <TableRow className="border-gray-200 dark:border-white/10">
                      <TableHead className="w-10 px-3 py-2.5" />
                      <TableHead className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        File Name
                      </TableHead>
                      <TableHead className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Predicted At
                      </TableHead>
                      <TableHead className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPredictions.map((record) => (
                      <TableRow
                        key={record.id}
                        className="border-gray-100 transition hover:bg-gray-50 dark:border-white/6 dark:hover:bg-white/5"
                      >
                        <TableCell className="px-3 py-2.5">
                          <input
                            type="checkbox"
                            checked={selectedRowKeys.includes(record.id)}
                            onChange={() =>
                              onSelectChange(
                                selectedRowKeys.includes(record.id)
                                  ? selectedRowKeys.filter(
                                      (k) => k !== record.id,
                                    )
                                  : [...selectedRowKeys, record.id],
                                selectedPredictions.includes(record)
                                  ? selectedPredictions.filter(
                                      (r) => r !== record,
                                    )
                                  : [...selectedPredictions, record],
                              )
                            }
                            className="accent-blue-600"
                          />
                        </TableCell>
                        <TableCell className="px-3 py-2.5 font-medium text-gray-900 dark:text-white">
                          {record.file_name}
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help text-sm text-gray-500 dark:text-gray-400">
                                  {formatDistanceToNow(
                                    new Date(record.created_at),
                                    { addSuffix: true },
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {format(
                                  new Date(record.created_at),
                                  "HH:mm:ss, dd/MM/yyyy",
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPrediction(record)}
                            className="h-8 rounded-lg border-gray-200 text-sm text-gray-700 hover:bg-gray-50 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>

        <Dialog
          open={isModalVisible}
          onOpenChange={(o) => !o && handleCloseModal()}
        >
          <DialogContent
            className="max-w-[95vw] rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900"
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Prediction Details
              </DialogTitle>
            </DialogHeader>
            {isJsonLoading ? (
              <div className="flex min-h-40 items-center justify-center">
                <Spinner className="h-6 w-6" />
              </div>
            ) : (
              (() => {
                if (projectInfo.task_type?.includes("IMAGE"))
                  return (
                    <ImageHistoryViewer data={selectedPredictionContent} />
                  );
                if (projectInfo.task_type?.includes("MULTILABEL"))
                  return (
                    <MultilabelHistoryViewer
                      data={selectedPredictionContent}
                      ref={multilabelModalRef}
                    />
                  );
                return (
                  <TextHistoryViewer
                    data={selectedPredictionContent}
                    ref={simpleDataModalRef}
                  />
                );
              })()
            )}
            <DialogFooter>
              {!projectInfo.task_type?.includes("IMAGE") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => simpleDataModalRef.current?.openDrawer()}
                  className="h-9 rounded-xl border-gray-200 px-4 text-sm text-gray-700 hover:bg-gray-50 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  <SettingOutlined className="mr-1.5 h-4 w-4" />
                  Column Settings
                </Button>
              )}
              {!projectInfo.task_type?.includes("IMAGE") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadHistory}
                  disabled={!selectedPredictionContent}
                  className="h-9 rounded-xl border-gray-200 px-4 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  <DownloadOutlined className="mr-1.5 h-4 w-4" />
                  Download CSV
                </Button>
              )}
              <Button
                type="button"
                onClick={handleCloseModal}
                className="h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isDatasetModalVisible}
          onOpenChange={(o) => !o && setIsDatasetModalVisible(false)}
        >
          <DialogContent className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Select Base Dataset for Retraining
              </DialogTitle>
            </DialogHeader>
            {isLoadingDatasets ? (
              <div className="flex min-h-40 items-center justify-center">
                <Spinner className="h-6 w-6" />
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 dark:border-white/10">
                <Table className="text-sm">
                  <TableHeader className="bg-gray-50 dark:bg-white/5">
                    <TableRow className="border-gray-200 dark:border-white/10">
                      <TableHead className="w-10 px-3 py-2.5" />
                      <TableHead className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Project Name
                      </TableHead>
                      <TableHead className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Created At
                      </TableHead>
                      <TableHead className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Service
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableDatasets.map((record) => (
                      <TableRow
                        key={record.id}
                        className="border-gray-100 transition hover:bg-gray-50 dark:border-white/6 dark:hover:bg-white/5"
                      >
                        <TableCell className="px-3 py-2.5">
                          <input
                            type="radio"
                            checked={selectedDatasetKeys.includes(record.id)}
                            onChange={() => setSelectedDatasetKeys([record.id])}
                            className="accent-blue-600"
                          />
                        </TableCell>
                        <TableCell className="px-3 py-2.5 font-medium text-gray-900 dark:text-white">
                          {record.name}
                        </TableCell>
                        <TableCell className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                          {record.created_at
                            ? format(
                                new Date(record.created_at),
                                "HH:mm:ss, dd/MM/yyyy",
                              )
                            : "-"}
                        </TableCell>
                        <TableCell className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                          {record.service}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDatasetModalVisible(false)}
                className="h-9 rounded-xl border-gray-200 px-4 text-sm text-gray-700 hover:bg-gray-50 dark:border-white/15 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmRetrain}
                disabled={isRetraining || selectedDatasetKeys.length === 0}
                className="h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                {isRetraining && <Spinner className="mr-2" />}
                Confirm Retrain
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
