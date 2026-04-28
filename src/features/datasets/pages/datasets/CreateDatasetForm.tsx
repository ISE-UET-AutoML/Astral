import React, { useState, useRef, useEffect } from "react";
import {
  Folder as FolderOutlined,
  File as FileOutlined,
  Trash2 as DeleteOutlined,
  CircleQuestionMark as QuestionCircleOutlined,
} from "lucide-react";
import { CustomSelect, Option } from "src/components/ui/custom-select";
import clsx from "clsx";
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

const Select = ({ options = [], ...props }) => (
  <CustomSelect {...props}>
    {options.map((option) => (
      <Option key={option.value} value={option.value}>
        {option.label}
      </Option>
    ))}
  </CustomSelect>
);

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

    // Re-detect labels from remaining files
    const fileMap = organizeFiles(updatedFiles);
    const labels = Array.from(fileMap.keys()).filter(
      (label) => label !== "unlabeled",
    );
    setDetectedLabels(labels);

    // Re-extract CSV metadata if CSV file still exists
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

  // Chuẩn bị Props cho input file
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

  // Tạo mảng Options cho Custom Select
  const dataTypeOptions = Object.entries(DATASET_TYPES).map(([key, value]) => ({
    label: value.type,
    value: key,
  }));

  const taskTypeOptions = datasetType
    ? getAvailableTaskTypes().map((task) => ({
        label: `${task.displayName}`,
        value: task.key,
      }))
    : [];

  const bucketOptions = [
    { label: "user-private-dataset", value: "user-private-dataset" },
    { label: "bucket-2", value: "bucket-2" },
  ];

  // CSS classes cho Input
  const inputClass =
    "w-full px-3 py-2 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-color)] placeholder-[var(--placeholder-color)] focus:outline-none focus:border-[var(--input-focus-border)] focus:shadow-[var(--input-shadow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass =
    "block mb-2 font-medium text-[var(--form-label-color)] text-sm";

  return (
    <form
      id="create-dataset-form-step0"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 font-poppins"
    >
      {/* Hàng 1: Title */}
      <div>
        <label className={labelClass}>
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter dataset title (letters and numbers only)"
          className={inputClass}
        />
        {errors.title && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.title}
          </span>
        )}
      </div>

      {/* Hàng 2: Data Type và Task Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Data Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={datasetType || undefined} // Tránh lỗi controlled state ban đầu
            onChange={(val) => {
              setDatasetType(val);
              setTaskType("");
              handleReset();
            }}
            placeholder="Select dataset type"
            options={dataTypeOptions}
          />
          {errors.datasetType && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.datasetType}
            </span>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Task Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={taskType || undefined}
            onChange={(val) => setTaskType(val)}
            disabled={!datasetType}
            placeholder={
              !datasetType ? "-- Select Data Type first --" : "Select task type"
            }
            options={taskTypeOptions}
          />
          {errors.taskType && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.taskType}
            </span>
          )}
        </div>
      </div>

      {/* Preparing Instructions */}
      {currentTaskInfo?.preparingInstructions && (
        <details className="group border border-[#ddd] rounded-lg bg-[rgba(255,255,255,0.97)] overflow-hidden">
          <summary className="flex items-center cursor-pointer p-3 font-medium text-green-600 outline-none list-none select-none">
            <QuestionCircleOutlined className="mr-2" />
            Task Preparation Instructions ({currentTaskInfo.displayName})
            <span className="ml-auto transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>
          <div className="p-4 pt-0 border-t border-[#ddd] whitespace-pre-line text-[var(--text)] text-sm mt-2">
            {currentTaskInfo.preparingInstructions}
          </div>
        </details>
      )}

      {/* Hàng 3: Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={2}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} resize-none`}
        />
        <div className="text-right text-xs text-[var(--secondary-text)] mt-1">
          {description.length} / 500
        </div>
      </div>

      {/* Hàng 4: Provider & Bucket */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
        <div>
          <label className={labelClass}>Storage Provider</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--text)] text-sm">
              <input
                type="radio"
                value="AWS_S3"
                checked={service === "AWS_S3"}
                onChange={(e) => setService(e.target.value)}
                className="accent-[var(--button-primary-bg)] w-4 h-4 cursor-pointer"
              />
              AWS S3
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[var(--text)] text-sm">
              <input
                type="radio"
                value="GCP_STORAGE"
                checked={service === "GCP_STORAGE"}
                onChange={(e) => setService(e.target.value)}
                className="accent-[var(--button-primary-bg)] w-4 h-4 cursor-pointer"
              />
              Google Cloud
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass}>Bucket Name</label>
          <Select
            value={bucketName}
            onChange={(val) => setBucketName(val)}
            options={bucketOptions}
          />
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="mt-2">
        <div className="flex border-b border-[var(--divider-color)] mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`py-2 px-4 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "file"
                ? "border-[var(--tabs-ink-bar)] text-[var(--tabs-active-text)]"
                : "border-transparent text-[var(--tabs-text)] hover:text-[var(--tabs-active-text)]"
            }`}
          >
            File Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`py-2 px-4 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "url"
                ? "border-[var(--tabs-ink-bar)] text-[var(--tabs-active-text)]"
                : "border-transparent text-[var(--tabs-text)] hover:text-[var(--tabs-active-text)]"
            }`}
          >
            Remote URL
          </button>
        </div>

        {/* Tab Content: File Upload */}
        {activeTab === "file" && (
          <div>
            <label
              htmlFor="file"
              className={clsx(
                "mb-4 flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300",
                isDragging
                  ? "border-[var(--modal-close-hover)] bg-[var(--hover-bg)]"
                  : "border-[var(--upload-border)] bg-[var(--upload-bg)]",
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {isFolderUpload ? (
                  <FolderOutlined className="text-[64px] text-[var(--upload-icon)]" />
                ) : (
                  <FileOutlined className="text-[64px] text-[var(--upload-icon)]" />
                )}
                <p className="mt-2 text-[var(--upload-text)] text-sm">
                  {isFolderUpload
                    ? "Drag and drop a folder or click to upload"
                    : "Drag and drop files or click to upload"}
                </p>
              </div>
              <input {...fileInputProps} />
            </label>

            <div className="text-[var(--text)] text-sm">
              <span className="font-medium">{files.length} Files</span>
              <span className="ml-2 text-[var(--secondary-text)]">
                ({totalKbytes} kB)
              </span>
            </div>

            {files.length > 0 && (
              <div className="max-h-[120px] sm:max-h-[180px] overflow-y-auto bg-[var(--upload-bg)] rounded-lg p-2 mt-3 [scrollbar-width:thin]">
                {files.map((file) => (
                  <div
                    key={file.fileId ?? file.path}
                    className="flex items-center border-b border-[var(--divider-color)] py-2 text-[var(--text)] text-sm last:border-0"
                  >
                    <FileOutlined className="mr-2 text-[var(--upload-icon)]" />
                    <span className="flex-1 truncate">{file.path}</span>
                    <span className="ml-2 text-[var(--secondary-text)] text-xs mr-2">
                      ({(file.fileObject?.size / 1024 || 0).toFixed(2)} kB)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file.fileId ?? file.path)}
                      className="text-[var(--secondary-text)] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer px-2"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: URL */}
        {activeTab === "url" && (
          <div>
            <label className={labelClass}>
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter remote URL"
              className={inputClass}
            />
            {errors.url && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.url}
              </span>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
