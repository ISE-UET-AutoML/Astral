import type { ComponentType, MouseEvent, SVGProps } from "react";
import {
  Database as CircleStackIcon,
  Trash as TrashIcon,
  Image as PhotoIcon,
  FileText as DocumentTextIcon,
  Table as TableCellsIcon,
  Grid2x2 as Squares2X2Icon,
  ChartBar as ChartBarIcon,
  RefreshCw as ArrowPathIcon,
  ExternalLink,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Progress } from "src/components/ui/progress";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { toast } from "sonner";
import type { Dataset } from "src/features/datasets/types";

dayjs.extend(relativeTime);

// Status badge config — mapped to semantic color set per design prompt
const PROCESSING_STATUS = {
  COMPLETED: {
    text: "Completed",
    badge:
      "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  CREATING_DATASET: {
    text: "Creating…",
    badge:
      "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  PROCESSING: {
    text: "Processing",
    badge:
      "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  CREATING_LABEL_PROJECT: {
    text: "Creating Label Project…",
    badge:
      "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  FAILED: {
    text: "Failed",
    badge:
      "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  },
};

const TYPE_ICON_MAP = {
  IMAGE: PhotoIcon,
  TEXT: DocumentTextIcon,
  TABULAR: TableCellsIcon,
  TEXT_CLASSIFICATION: DocumentTextIcon,
  MULTILABEL_TEXT_CLASSIFICATION: DocumentTextIcon,
  TABULAR_CLASSIFICATION: TableCellsIcon,
  TABULAR_REGRESSION: TableCellsIcon,
  MULTILABEL_TABULAR_CLASSIFICATION: TableCellsIcon,
  MULTIMODAL_CLASSIFICATION: Squares2X2Icon,
  MULTILABEL_IMAGE_CLASSIFICATION: PhotoIcon,
  OBJECT_DETECTION: PhotoIcon,
  SEMANTIC_SEGMENTATION: PhotoIcon,
  MULTIMODAL: Squares2X2Icon,
  TIME_SERIES: ChartBarIcon,
};

type DatasetStatus = keyof typeof PROCESSING_STATUS;
type DatasetTypeKey = keyof typeof TYPE_ICON_MAP;
type DatasetCardProps = {
  dataset: Dataset;
  onDelete: (datasetId: string) => void;
  isDeleting?: boolean;
};
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type TypeFamily =
  | "IMAGE"
  | "TEXT"
  | "TABULAR"
  | "TIME_SERIES"
  | "MULTIMODAL"
  | "OBJECT_DETECTION"
  | "SEMANTIC_SEGMENTATION";

const resolveTypeFamily = (key: string): TypeFamily => {
  if (!key) return "TEXT";
  if (key.includes("OBJECT") || key.includes("DETECTION"))
    return "OBJECT_DETECTION";
  if (key.includes("SEGMENTATION")) return "SEMANTIC_SEGMENTATION";
  if (key.includes("IMAGE")) return "IMAGE";
  if (key.includes("MULTIMODAL") || key.includes("MULTI_MODAL"))
    return "MULTIMODAL";
  if (key.includes("TIME") || key.includes("SERIES")) return "TIME_SERIES";
  if (key.includes("TABULAR") || key.includes("TABLE")) return "TABULAR";
  if (key.includes("TEXT") || key.includes("NLP")) return "TEXT";
  return "TEXT";
};

// All icon colors use the blue identity scale per design prompt
const TYPE_ICON_CLASS: Record<TypeFamily, string> = {
  IMAGE: "text-blue-500 dark:text-blue-400",
  TEXT: "text-blue-500 dark:text-blue-400",
  TABULAR: "text-blue-500 dark:text-blue-400",
  TIME_SERIES: "text-blue-500 dark:text-blue-400",
  MULTIMODAL: "text-blue-500 dark:text-blue-400",
  OBJECT_DETECTION: "text-blue-500 dark:text-blue-400",
  SEMANTIC_SEGMENTATION: "text-blue-500 dark:text-blue-400",
};

// Top accent bar color per type
const TYPE_ACCENT_BAR: Record<TypeFamily, string> = {
  IMAGE: "from-blue-500 to-blue-400",
  TEXT: "from-blue-500 to-blue-400",
  TABULAR: "from-blue-500 to-blue-400",
  TIME_SERIES: "from-blue-500 to-blue-400",
  MULTIMODAL: "from-blue-500 to-blue-400",
  OBJECT_DETECTION: "from-blue-500 to-blue-400",
  SEMANTIC_SEGMENTATION: "from-blue-500 to-blue-400",
};

export default function DatasetCard({
  dataset,
  onDelete,
  isDeleting: _isDeleting,
}: DatasetCardProps) {
  const handleDelete = (
    e: MouseEvent<HTMLButtonElement>,
    datasetID: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this dataset?")) {
      onDelete(datasetID);
    }
  };

  const dataType = dataset.dataType || "UNKNOWN";
  const processingStatus = dataset.processingStatus || "PROCESSING";
  const totalFiles = dataset.metaData?.totalFiles || 0;
  const totalSizeKb = dataset.metaData?.totalSizeKb || 0;
  const createdAtDisplay = dataset?.createdAt
    ? dayjs(dataset.createdAt).format("MMM D, YYYY")
    : "N/A";
  const thumbnail = dataset?.thumbnail;
  const isCompleted = processingStatus === "COMPLETED";
  const isProcessing = [
    "PROCESSING",
    "CREATING_DATASET",
    "CREATING_LABEL_PROJECT",
  ].includes(processingStatus);
  const isFailed = processingStatus === "FAILED";

  const statusConfig =
    PROCESSING_STATUS[processingStatus as DatasetStatus] ||
    PROCESSING_STATUS.PROCESSING;

  const lsProjectId = dataset.lsProject?.labelStudioId || null;
  const lsProject = dataset.lsProject || {};
  const annotatedCount = lsProject.annotatedNums || 0;
  const totalAnnotations = lsProject.annotationNums || dataset.quantity || 0;
  const progress =
    totalAnnotations > 0
      ? Math.round((annotatedCount / totalAnnotations) * 100)
      : 0;

  const normalizedKey = (dataType || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/_+/, "_")
    .replace(/^_|_$/, "");
  const familyKey = resolveTypeFamily(normalizedKey);
  const TypeIcon = (TYPE_ICON_MAP[familyKey as DatasetTypeKey] ||
    TYPE_ICON_MAP[normalizedKey as DatasetTypeKey] ||
    CircleStackIcon) as IconComponent;
  const iconClass = TYPE_ICON_CLASS[familyKey];
  const accentBar = TYPE_ACCENT_BAR[familyKey];

  const handleCardClick = () => {
    if (isCompleted && lsProjectId) {
      window.open(
        `${import.meta.env.VITE_LABEL_STUDIO_URL}/projects/${lsProjectId}`,
        "_blank",
      );
    } else if (!isCompleted) {
      toast.info("Dataset is still processing. Please wait for completion.");
    } else {
      toast.error("Label Studio ID is missing for this project.");
    }
  };

  return (
    <div
      className={`group relative flex min-h-[360px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white transition duration-300 dark:bg-slate-900 ${
        isCompleted
          ? "border-gray-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-sm dark:border-white/10 dark:hover:border-blue-700/40"
          : isFailed
            ? "border-red-200 dark:border-red-700/40"
            : "border-blue-200/60 dark:border-blue-700/30"
      }`}
      onClick={handleCardClick}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full shrink-0 bg-gradient-to-r ${accentBar}`}
      />

      {/* Blurred content when processing */}
      <div className={`flex flex-1 flex-col ${isProcessing ? "blur-sm" : ""}`}>
        {/* Header / Thumbnail Area */}
        <div className="relative h-28 w-full shrink-0 overflow-hidden bg-gray-50/50 dark:bg-slate-800/30">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="dataset thumbnail"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 text-slate-900/[0.03] dark:text-white/[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                  backgroundSize: "16px 16px",
                }}
              />
              <TypeIcon
                className="absolute -bottom-4 -right-4 size-32 -rotate-12 text-blue-500/10 dark:text-blue-400/10"
                aria-hidden="true"
              />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 dark:to-slate-900/90" />
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col px-5 py-4">
          {/* Top row: status badge + actions */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <Badge className={statusConfig.badge}>
              {isProcessing && (
                <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-amber-500" />
              )}
              {statusConfig.text}
            </Badge>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Delete dataset"
                onClick={(e) => handleDelete(e, dataset.id)}
                className="size-7 rounded-lg border-gray-200 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-white/15 dark:bg-slate-900/75 dark:hover:bg-red-950/30"
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Icon + type tag */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:border-white/10 dark:from-blue-500/15 dark:to-blue-600/10">
              <TypeIcon className={`size-5 ${iconClass}`} aria-hidden="true" />
            </div>
            <span className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-400">
              {dataType.replace(/_/g, " ")}
            </span>
          </div>

          {/* Title */}
          <h2 className="mb-3 truncate text-base font-bold leading-tight text-gray-900 dark:text-white">
            {dataset.title || "Untitled Dataset"}
          </h2>

          {/* Divider */}
          <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />

          {/* Metadata grid */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-400 dark:text-gray-500">Created</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {createdAtDisplay}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-400 dark:text-gray-500">Files</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {totalFiles.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-400 dark:text-gray-500">Size</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {totalSizeKb ? (totalSizeKb / 1024).toFixed(1) + " MB" : "N/A"}
              </span>
            </div>
          </div>

          {/* Annotation progress */}
          {totalAnnotations > 0 && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-gray-400 dark:text-gray-500">
                  Annotations
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {annotatedCount.toLocaleString()} /{" "}
                  {totalAnnotations.toLocaleString()}
                </span>
              </div>
              <Progress
                value={progress}
                className="h-1.5 bg-gray-200 dark:bg-white/10 [&>[data-slot=progress-indicator]]:bg-blue-500 dark:[&>[data-slot=progress-indicator]]:bg-blue-400"
              />
              <div
                className={`mt-1 text-right text-xs font-semibold ${
                  isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {progress}%
              </div>
            </div>
          )}

          {/* Open in Label Studio hint */}
          {isCompleted && lsProjectId && (
            <div className="mt-auto pt-4">
              <div className="flex items-center gap-1 text-xs text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-blue-400">
                <ExternalLink className="size-3" />
                Open in Label Studio
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-14 items-center justify-center rounded-full border border-blue-200/50 bg-white/90 shadow-lg dark:border-white/20 dark:bg-slate-900/90">
              <ArrowPathIcon
                className="size-7 animate-spin text-blue-500"
                aria-hidden="true"
              />
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Processing…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
