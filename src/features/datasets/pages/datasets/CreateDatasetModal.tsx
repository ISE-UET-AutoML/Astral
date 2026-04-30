import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import {
  createChunks,
  organizeFiles,
  extractCSVMetaData,
} from "src/utils/file";
import { uploadToS3 } from "src/utils/s3";
import { IMG_NUM_IN_ZIP } from "src/constants/file";
import * as datasetAPI from "src/features/datasets/api/dataset";
import { Spinner } from "src/components/ui/spinner";
import { Button } from "src/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import CreateDatasetForm from "./CreateDatasetForm";
import CreateLabelProjectForm from "./CreateLabelProjectForm";

type S3UploadFile =
  | {
      key: string;
      type: "application/json";
      content: string;
    }
  | {
      key: string;
      type: "application/zip";
      files: any[];
    };

const CreateDatasetModal = ({ visible, onCancel, onCreate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [datasetFormValues, setDatasetFormValues] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canSubmitLabelForm, setCanSubmitLabelForm] = useState(false);
  const [labelProjectData, setLabelProjectData] = useState(null);
  const showError = (msg) => toast.error(msg);

  const handleNext = async (values) => {
    setDatasetFormValues(values);
    setCurrentStep(1);
  };

  const handleBack = () => {
    setCurrentStep(0);
    setCanSubmitLabelForm(false);
  };

  const isImageFolder = (files) => {
    const allowedImageExtensions = ["jpg", "jpeg", "png", "webp"];
    return files.every((file) =>
      allowedImageExtensions.includes(file.path.split(".").pop().toLowerCase()),
    );
  };
  const isAudioFolder = (files) => {
    const allowedAudioExtensions = ["mp3", "wav", "ogg", "m4a", "flac"];
    return files.every((file) =>
      allowedAudioExtensions.includes(file.path.split(".").pop().toLowerCase()),
    );
  };
  const isVideoFolder = (files) => {
    const allowedVideoExtensions = ["mp4", "m4v", "avi"];
    return files.every((file) =>
      allowedVideoExtensions.includes(file.path.split(".").pop().toLowerCase()),
    );
  };

  const handleSubmit = async (labelProjectValues) => {
    try {
      setIsLoading(true);
      console.log(
        "handleSubmit called with labelProjectValues:",
        labelProjectValues,
      );
      const {
        files,
        totalKbytes,
        dataset_type,
        service,
        bucket_name,
        title,
        description,
        taskType,
      } = datasetFormValues;

      console.log("Initial dataset:", title);
      const initialDatasetPayload = { title, dataset_type };
      const initialResponse = await datasetAPI.initializeDataset(
        initialDatasetPayload,
      );
      console.log("Initial dataset created:", initialResponse.data);
      const createdDataset = initialResponse.data;
      const datasetID = createdDataset.id;
      if (!datasetID) {
        throw new Error("Không thể khởi tạo dataset trên server.");
      }
      console.log("Dataset ID:", datasetID);

      setLabelProjectData(labelProjectValues);
      console.log("labelProjectData set to:", labelProjectValues);
      const fileMap = organizeFiles(files);
      const chunks = [];
      const zips = [];
      for (const [label, folderFiles] of fileMap.entries()) {
        if (isImageFolder(folderFiles)) {
          const folderChunk = createChunks(
            new Map([[label, folderFiles]]),
            IMG_NUM_IN_ZIP,
          );
          chunks.push(...folderChunk);
        } else if (dataset_type === "AUDIO" && isAudioFolder(folderFiles)) {
          const folderChunk = createChunks(
            new Map([[label, folderFiles]]),
            IMG_NUM_IN_ZIP,
          );
          chunks.push(...folderChunk);
        } else if (dataset_type === "VIDEO" && isVideoFolder(folderFiles)) {
          const folderChunk = createChunks(
            new Map([[label, folderFiles]]),
            IMG_NUM_IN_ZIP,
          );
          chunks.push(...folderChunk);
        } else {
          zips.push({ name: `chunk_unlabel_0.zip`, files: folderFiles });
        }
      }

      let extraMeta = {};
      const csvFile = files.find((f) => f.path.endsWith(".csv"));
      if (
        (dataset_type === "TEXT" ||
          dataset_type === "TABULAR" ||
          dataset_type === "MULTIMODAL" ||
          dataset_type === "TIME_SERIES") &&
        csvFile
      ) {
        try {
          extraMeta = await extractCSVMetaData(csvFile.fileObject);
        } catch (err) {
          console.warn("CSV meta extraction failed", err);
        }
      }

      const fileToChunkMap = new Map();
      chunks.forEach((chunk) => {
        chunk.files.forEach((file) => {
          fileToChunkMap.set(file.path, chunk.name);
        });
      });

      const indexData = {
        dataset_title: title,
        dataset_type,
        files: files.map((file) => {
          const parts = file.path.split("/");
          const simplePath =
            parts.length > 1 ? parts.slice(1).join("/") : file.path;
          return {
            path: `${datasetID}/${simplePath}`,
            chunk: fileToChunkMap.get(file.path) || null,
          };
        }),
        chunks: chunks.map((chunk) => ({
          name: chunk.name,
          file_count: chunk.files.length,
        })),
      };

      const s3Files: S3UploadFile[] = [
        {
          key: `${datasetID}/index.json`,
          type: "application/json",
          content: JSON.stringify(indexData, null, 2),
        },
        ...chunks.map((chunk) => ({
          key: `${datasetID}/zip/${chunk.name}`,
          type: "application/zip" as const,
          files: chunk.files,
        })),
        ...zips.map((zip) => ({
          key: `${datasetID}/zip/${zip.name}`,
          type: "application/zip" as const,
          files: zip.files,
        })),
      ];

      const presignPayload = {
        dataset_title: datasetID,
        files: s3Files.map((file) => ({ key: file.key, type: file.type })),
      };

      const { data: presignedUrls } =
        await datasetAPI.createPresignedUrls(presignPayload);
      for (const file of s3Files) {
        const url = presignedUrls.find((u) => u.key === file.key)?.url;
        if (!url) throw new Error(`Missing presigned URL for ${file.key}`);

        if (file.type === "application/json") {
          await uploadToS3(
            url,
            new Blob([file.content], { type: "application/json" }),
          );
        } else {
          const zip = new JSZip();
          for (const f of file.files) {
            let zipPath;
            if (f.path.split("/").length === 2) {
              const name = f.path.split("/").pop();
              zipPath = `unlabel_${name}`;
            } else {
              zipPath = f.path.split("/").slice(-2).join("_");
            }
            zip.file(zipPath, f.fileObject);
          }
          const zipBlob = await zip.generateAsync({ type: "blob" });
          await uploadToS3(url, zipBlob);
        }
      }

      const finalizePayload = {
        service,
        bucket_name,
        total_files: files.length,
        total_size_kb: parseFloat(totalKbytes) || 0,
        index_path: `${datasetID}/index.json`,
        chunks: chunks.map((chunk) => ({
          name: chunk.name,
          file_count: chunk.files.length,
          s3_path: `${datasetID}/zip/${chunk.name}`,
        })),
        status: "active",
        meta_data: extraMeta,
      };
      console.log("ID đang được dùng để finalize:", datasetID);
      await datasetAPI.finalizeDataset(datasetID, finalizePayload);
      console.log("Dataset finalized on server");
      onCreate(createdDataset, labelProjectValues);
      handleCancel();
    } catch (err) {
      console.error("Submit error:", err);
      showError("Failed to create dataset and label project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentStep(0);
    setDatasetFormValues(null);
    setLabelProjectData(null);
    setIsLoading(false);
    setCanSubmitLabelForm(false);
    onCancel();
  };

  useEffect(() => {
    if (visible) {
      const scrollY = window.scrollY;
      const prevPosition = document.body.style.position;
      const prevTop = document.body.style.top;
      const prevWidth = document.body.style.width;
      const prevLeft = document.body.style.left;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.left = "0";
      return () => {
        document.body.style.position = prevPosition;
        document.body.style.top = prevTop;
        document.body.style.width = prevWidth;
        document.body.style.left = prevLeft;
        window.scrollTo(0, scrollY);
      };
    }
  }, [visible]);

  if (!visible) return null;

  const isTabular = datasetFormValues?.dataset_type === "TABULAR";

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden overscroll-contain">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleCancel}
          aria-hidden="true"
        />

        {/* Modal Panel */}
        <div
          className={`relative z-[1001] mx-4 flex w-full flex-col max-h-[88dvh] rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900 sm:mx-6 lg:mx-8 ${
            isTabular
              ? "max-w-[95vw] sm:max-w-[640px] lg:max-w-[900px]"
              : "max-w-[90vw] sm:max-w-[600px] lg:max-w-[800px]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between rounded-t-2xl border-b border-gray-200 bg-gray-50/80 px-6 py-4 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Create New Dataset
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              aria-label="Close dialog"
              className="flex size-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="shrink-0 flex items-center gap-2 px-6 py-3 border-b border-gray-100 dark:border-white/6">
            {["Dataset Info", "Label Project"].map((label, idx) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex size-5 items-center justify-center rounded-full text-xs font-semibold ${
                      currentStep === idx
                        ? "bg-blue-600 text-white dark:bg-blue-500"
                        : idx < currentStep
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 text-gray-500 dark:bg-white/15 dark:text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      currentStep === idx
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < 1 && (
                  <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Body */}
          <div
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-6"
            style={{ scrollbarWidth: "thin" }}
          >
            {isLoading ? (
              <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Spinner className="size-6" />
                <span>Processing dataset, please wait…</span>
              </div>
            ) : (
              <>
                {currentStep === 0 ? (
                  <CreateDatasetForm
                    onNext={handleNext}
                    onCancel={handleCancel}
                    initialValues={datasetFormValues}
                    initialFiles={datasetFormValues?.files || []}
                    initialDetectedLabels={
                      datasetFormValues?.detectedLabels || []
                    }
                    initialCsvMetadata={datasetFormValues?.csvMetadata || null}
                  />
                ) : (
                  <CreateLabelProjectForm
                    onSubmit={handleSubmit}
                    onBack={handleBack}
                    onCancel={handleCancel}
                    onValidityChange={setCanSubmitLabelForm}
                    loading={isLoading}
                    datasetType={datasetFormValues?.dataset_type}
                    taskType={datasetFormValues?.taskType}
                    description={datasetFormValues?.description}
                    initialValues={{ name: datasetFormValues?.title }}
                    detectedLabels={datasetFormValues?.detectedLabels || []}
                    csvMetadata={datasetFormValues?.csvMetadata}
                  />
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!isLoading && (
            <div className="shrink-0 flex justify-end gap-2 rounded-b-2xl border-t border-gray-200 bg-gray-50/80 px-6 py-4 dark:border-white/10 dark:bg-white/5">
              {currentStep === 0 ? (
                <Button
                  type="submit"
                  form="create-dataset-form-step0"
                  className="h-9 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Next →
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBack();
                    }}
                    className="h-9 rounded-xl border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-white/15 dark:bg-slate-900/75 dark:text-gray-300 dark:hover:bg-white/10"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    form="create-label-project-form-step1"
                    disabled={!canSubmitLabelForm}
                    className="h-9 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-400"
                  >
                    Create Dataset
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateDatasetModal;
