import React, { useState, useRef, useEffect } from "react";
import {
  Folder,
  File,
  Trash2,
  ChevronDown,
  ChevronRight,
  Info,
  UploadCloud,
} from "lucide-react";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { cn } from "src/lib/utils";
import { DATASET_TYPES } from "src/constants/types";
import {
  organizeFiles,
  createChunks,
  extractCSVMetaData,
} from "src/utils/file";
import {
  DATASET_TASK_MAPPING,
  TASK_TYPE_INFO,
} from "src/constants/dataset_task_mapping";

type DatasetFormErrors = Record<string, string>;
type UploadInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.RefAttributes<HTMLInputElement> & {
    webkitdirectory?: string;
    directory?: string;
  };

export default function CreateDatasetForm({
  onNext,
  onCancel,
  initialValues,
  initialFiles = [],
  initialDetectedLabels = [],
  initialCsvMetadata = null,
}) {
  // Form States
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || "",
  );
  const [datasetType, setDatasetType] = useState(
    initialValues?.dataset_type || "",
  );
  const [taskType, setTaskType] = useState(initialValues?.taskType || "");
  const [service, setService] = useState(initialValues?.service || "AWS_S3");
  const [bucketName, setBucketName] = useState(
    initialValues?.bucket_name || "user-private-dataset",
  );
  const [url, setUrl] = useState(initialValues?.url || "");

  // UI States
  const [activeTab, setActiveTab] = useState("file"); // 'file' or 'url'
  const [errors, setErrors] = useState<DatasetFormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  // File States
  const [files, setFiles] = useState(initialFiles);
  const [detectedLabels, setDetectedLabels] = useState(initialDetectedLabels);
  const [csvMetadata, setCsvMetadata] = useState(initialCsvMetadata);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileRefs = useRef(new Map());

  const calcSizeKB = (fileArr) => {
    const totalSize = fileArr.reduce(
      (sum, f) => sum + (f.fileObject?.size || 0),
      0,
    );
    return totalSize > 0 ? (totalSize / 1024).toFixed(2) : "0.00";
  };
  const [totalKbytes, setTotalKbytes] = useState(calcSizeKB(initialFiles));

  useEffect(() => {
    if (initialFiles.length) {
      const filesWithId = initialFiles.map((f, i) => ({
        ...f,
        fileId: f.fileId ?? `${f.path}::${i}`,
      }));
      setFiles(filesWithId);
      setTotalKbytes(calcSizeKB(filesWithId));
    }
    if (initialDetectedLabels.length) setDetectedLabels(initialDetectedLabels);
    if (initialCsvMetadata) setCsvMetadata(initialCsvMetadata);
  }, [initialFiles, initialDetectedLabels, initialCsvMetadata]);

  const validateFiles = (files, datasetType) => {
    const allowedImageTypes = ["image/jpeg", "image/png"];
    const allowedTextTypes = [
      "text/plain",
      "text/csv",
      "application/xml",
      "text/xml",
    ];
    const allowedAudioTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp4",
      "audio/x-m4a",
      "audio/flac",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/x-m4v",
      "video/webm",
      "video/quicktime",
      "video/avi",
    ];
    const allowedTypes = {
      IMAGE: [...allowedImageTypes, ...allowedTextTypes],
      TEXT: allowedTextTypes,
      TABULAR: allowedTextTypes,
      MULTIMODAL: [...allowedImageTypes, ...allowedTextTypes],
      TIME_SERIES: [...allowedTextTypes],
      AUDIO: [...allowedAudioTypes, ...allowedTextTypes],
      VIDEO: [...allowedVideoTypes, ...allowedTextTypes],
    };
    return files.filter(
      (file) => file?.type && allowedTypes[datasetType]?.includes(file.type),
    );
  };

  const handleFileChange = async (event) => {
    const uploadedFiles = Array.from(event.target.files || []);
    const validatedFiles = validateFiles(uploadedFiles, datasetType);

    const hasImageFolder = validatedFiles.some(
      (file) =>
        file.webkitRelativePath && file.webkitRelativePath.includes("/images/"),
    );
    const hasCSVFile = validatedFiles.some((file) =>
      (file.webkitRelativePath || file.name || "")
        .toLowerCase()
        .endsWith(".csv"),
    );

    if (datasetType === "MULTIMODAL" && (!hasImageFolder || !hasCSVFile)) {
      alert(
        "Error: For MULTIMODAL datasets, upload a folder with images and a CSV file.",
      );
      return;
    }

    const totalSize = validatedFiles.reduce(
      (sum, file) => sum + (file.size || 0),
      0,
    );
    const totalSizeInKB =
      totalSize > 0 ? (totalSize / 1024).toFixed(2) : "0.00";

    const fileMetadata = validatedFiles.map((file, index) => {
      const path = file.webkitRelativePath || file.name;
      return {
        path,
        fileId: `${path}::${index}`,
        fileObject: file,
      };
    });

    const fileMap = organizeFiles(fileMetadata);
    const labels = Array.from(fileMap.keys()).filter(
      (label) => label !== "unlabeled",
    );
    setDetectedLabels(labels);

    const csvFile = validatedFiles.find((file) =>
      (file.webkitRelativePath || file.name || "")
        .toLowerCase()
        .endsWith(".csv"),
    );

    if (csvFile) {
      try {
        const metadata = await extractCSVMetaData(csvFile);
        setCsvMetadata(metadata);
      } catch (err) {
        console.error("Failed to extract CSV metadata:", err);
        alert("Failed to analyze CSV file");
      }
    }

    setFiles(fileMetadata);
    setTotalKbytes(totalSizeInKB);
  };

  const handleDeleteFile = (fileId) => {
    const updatedFiles = files.filter(
      (file) => (file.fileId ?? file.path) !== fileId,
    );
    fileRefs.current.delete(fileId);
    setFiles(updatedFiles);

    const fileMap = organizeFiles(updatedFiles);
    const labels = Array.from(fileMap.keys()).filter(
      (label) => label !== "unlabeled",
    );
    setDetectedLabels(labels);

    const csvFile = updatedFiles.find((f) =>
      (f.path || "").toLowerCase().endsWith(".csv"),
    );
    if (csvFile?.fileObject) {
      extractCSVMetaData(csvFile.fileObject)
        .then((metadata) => setCsvMetadata(metadata))
        .catch((err) => {
          console.error("Failed to extract CSV metadata:", err);
          setCsvMetadata(null);
        });
    } else {
      setCsvMetadata(null);
    }

    const totalSize = updatedFiles.reduce((sum, file) => {
      const fileObj =
        file.fileObject || fileRefs.current.get(file.fileId ?? file.path);
      return sum + (fileObj?.size || 0);
    }, 0);
    setTotalKbytes(totalSize > 0 ? (totalSize / 1024).toFixed(2) : "0.00");
  };

  const handleReset = () => {
    if (fileInputRef.current) fileInputRef.current.value = null;
    setFiles([]);
    setTotalKbytes("0.00");
    setDetectedLabels([]);
    setCsvMetadata(null);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0)
      setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.currentTarget.contains(event.relatedTarget))
      setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const simulatedEvent = { target: { files: files } };
      if (fileInputRef.current) fileInputRef.current.files = files;
      handleFileChange(simulatedEvent);
    }
  };

  const getAvailableTaskTypes = () => {
    if (!datasetType) return [];
    const availableTypes = DATASET_TASK_MAPPING[datasetType] || [];
    return availableTypes.map((typeKey) => ({
      key: typeKey,
      ...TASK_TYPE_INFO[typeKey],
    }));
  };

  const validateForm = () => {
    const newErrors: DatasetFormErrors = {};
    if (!title.trim()) newErrors.title = "Please enter a title";
    if (!datasetType) newErrors.datasetType = "Please select a type";
    if (!taskType) newErrors.taskType = "Please select a task type";
    if (activeTab === "url" && !url.trim())
      newErrors.url = "Please enter a URL";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title,
      description,
      dataset_type: datasetType,
      taskType,
      service,
      bucket_name: bucketName,
      url: activeTab === "url" ? url : undefined,
      files: activeTab === "file" ? files : [],
      totalKbytes: activeTab === "file" ? totalKbytes : 0,
      detectedLabels,
      csvMetadata,
      meta_data: {
        detectedLabels,
        csvMetadata,
      },
    };
    onNext(payload);
  };

  const isFolderUpload = ["IMAGE", "MULTIMODAL", "AUDIO", "VIDEO"].includes(
    datasetType,
  );
  const fileInputProps: UploadInputProps = {
    ref: fileInputRef,
    type: "file",
    name: "file",
    id: "file",
    multiple: true,
    className: "hidden",
    onChange: handleFileChange,
  };
  if (isFolderUpload) {
    fileInputProps.webkitdirectory = "";
    fileInputProps.directory = "";
  } else if (datasetType) {
    const allowedExtensions = {
      TEXT: ".csv,.xlsx,.xls",
      TABULAR: ".csv,.xlsx,.xls",
      TIME_SERIES: ".csv,.xlsx,.xls",
      AUDIO: ".mp3,.wav,.ogg,.m4a,.flac,.csv,.xml",
      VIDEO: ".mp4,.m4v,.csv,.xml,.mov,.webm,.avi",
    };
    fileInputProps.accept = allowedExtensions[datasetType] || "";
  }

  const currentTaskInfo = TASK_TYPE_INFO[taskType];

  const dataTypeOptions = Object.entries(DATASET_TYPES).map(([key, value]) => ({
    label: value.type,
    value: key,
  }));

  const taskTypeOptions = datasetType
    ? getAvailableTaskTypes().map((task) => ({
        label: task.displayName,
        value: task.key,
      }))
    : [];

  const bucketOptions = [
    { label: "user-private-dataset", value: "user-private-dataset" },
    { label: "bucket-2", value: "bucket-2" },
  ];

  return (
    <form
      id="create-dataset-form-step0"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter dataset title"
          className={cn(
            "h-10 w-full rounded-xl border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500",
            errors.title &&
              "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/30",
          )}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Data Type & Task Type */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={datasetType || undefined}
            onValueChange={(val) => {
              setDatasetType(val);
              setTaskType("");
              handleReset();
            }}
          >
            <SelectTrigger
              className={cn(
                "h-10 w-full rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white",
                errors.datasetType && "border-red-400",
              )}
            >
              <SelectValue placeholder="Select dataset type" />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className="z-[1100] rounded-xl border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-950"
            >
              {dataTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.datasetType && (
            <p className="mt-1 text-xs text-red-500">{errors.datasetType}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Task Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={taskType || undefined}
            onValueChange={(val) => setTaskType(val)}
            disabled={!datasetType}
          >
            <SelectTrigger
              className={cn(
                "h-10 w-full rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white",
                !datasetType && "opacity-50 cursor-not-allowed",
                errors.taskType && "border-red-400",
              )}
            >
              <SelectValue
                placeholder={
                  !datasetType ? "Select Data Type first" : "Select task type"
                }
              />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className="z-[1100] rounded-xl border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-950"
            >
              {taskTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.taskType && (
            <p className="mt-1 text-xs text-red-500">{errors.taskType}</p>
          )}
        </div>
      </div>

      {/* Task Preparation Instructions */}
      {currentTaskInfo?.preparingInstructions && (
        <div className="overflow-hidden rounded-xl border border-blue-200 bg-blue-50/60 dark:border-blue-700/40 dark:bg-blue-900/10">
          <button
            type="button"
            onClick={() => setInstructionsOpen((v) => !v)}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100/60 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Info className="size-4 shrink-0" />
            <span>
              Preparation Instructions — {currentTaskInfo.displayName}
            </span>
            <ChevronDown
              className={cn(
                "ml-auto size-4 shrink-0 transition-transform",
                instructionsOpen && "rotate-180",
              )}
            />
          </button>
          {instructionsOpen && (
            <div className="border-t border-blue-200 px-4 py-3 text-sm text-gray-700 dark:border-blue-700/40 dark:text-gray-300">
              <p className="whitespace-pre-line leading-relaxed">
                {currentTaskInfo.preparingInstructions}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <Textarea
          rows={2}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe this dataset (optional)"
          className="w-full resize-none rounded-xl border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500"
        />
        <div className="mt-1 text-right text-xs text-gray-400 dark:text-gray-500">
          {description.length} / 500
        </div>
      </div>

      {/* Storage Provider & Bucket */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Storage Provider
          </label>
          <div className="flex gap-4 mt-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                value="AWS_S3"
                checked={service === "AWS_S3"}
                onChange={(e) => setService(e.target.value)}
                className="size-4 cursor-pointer accent-blue-600"
              />
              AWS S3
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                value="GCP_STORAGE"
                checked={service === "GCP_STORAGE"}
                onChange={(e) => setService(e.target.value)}
                className="size-4 cursor-pointer accent-blue-600"
              />
              Google Cloud
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bucket Name
          </label>
          <Select
            value={bucketName}
            onValueChange={(val) => setBucketName(val)}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className="z-[1100] rounded-xl border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-950"
            >
              {bucketOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Upload Tabs */}
      <div>
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200 dark:border-white/10">
          {[
            { id: "file", label: "File Upload" },
            { id: "url", label: "Remote URL" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* File Upload Tab */}
        {activeTab === "file" && (
          <div className="mt-4 space-y-3">
            <label
              htmlFor="file"
              className={cn(
                "flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-200",
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                  : "border-gray-200 bg-gray-50/80 hover:border-blue-300 hover:bg-blue-50/40 dark:border-white/15 dark:bg-white/5 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/10",
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {isFolderUpload ? (
                <Folder
                  className={cn(
                    "size-8 transition-colors",
                    isDragging
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500",
                  )}
                />
              ) : (
                <UploadCloud
                  className={cn(
                    "size-8 transition-colors",
                    isDragging
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500",
                  )}
                />
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isFolderUpload
                  ? "Drag & drop a folder or click to upload"
                  : "Drag & drop files or click to upload"}
              </p>
              <input {...fileInputProps} />
            </label>

            {/* File Count Summary */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <File className="size-4 text-blue-500 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {files.length} {files.length === 1 ? "File" : "Files"}
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                ({totalKbytes} kB)
              </span>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/80 dark:border-white/10 dark:bg-white/5 [scrollbar-width:thin]">
                {files.map((file) => (
                  <div
                    key={file.fileId ?? file.path}
                    className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 text-sm last:border-0 dark:border-white/6"
                  >
                    <File className="size-4 shrink-0 text-blue-500 dark:text-blue-400" />
                    <span className="flex-1 truncate text-gray-700 dark:text-gray-300">
                      {file.path}
                    </span>
                    <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                      {(file.fileObject?.size / 1024 || 0).toFixed(2)} kB
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file.fileId ?? file.path)}
                      aria-label="Remove file"
                      className="ml-1 shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Remote URL Tab */}
        {activeTab === "url" && (
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              URL <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/dataset.zip"
              className={cn(
                "h-10 w-full rounded-xl border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500",
                errors.url &&
                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/30",
              )}
            />
            {errors.url && (
              <p className="mt-1 text-xs text-red-500">{errors.url}</p>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
