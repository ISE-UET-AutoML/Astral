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
      className={`group relative flex min-h-[360px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-300 dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-lg dark:shadow-black/40 dark:ring-white/[0.06] dark:hover:shadow-2xl ${
        isCompleted
          ? "hover:-translate-y-1 hover:shadow-xl"
          : isFailed
            ? "border-red-200 dark:border-red-700/40"
            : "border-blue-200/60 dark:border-blue-700/30"
      }`}
      onClick={handleCardClick}
    >
      {/* Top accent bar */}
      <div
        className={`h-0.5 w-full shrink-0 bg-gradient-to-r ${accentBar}`}
      />

      {/* Blurred content when processing */}
      <div className={`flex flex-1 flex-col ${isProcessing ? "blur-sm" : ""}`}>
        <div className="relative aspect-[5/2] w-full min-h-[128px] max-h-[200px] shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900 sm:aspect-[2/1] sm:max-h-[220px]">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="dataset thumbnail"
              className="block h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
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
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/35 to-transparent dark:from-slate-900 dark:via-slate-900/40 dark:to-transparent"
            aria-hidden="true"
          />

          <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
            <Badge className={`border-0 shadow-md ring-1 ring-black/5 dark:ring-white/10 ${statusConfig.badge}`}>
              {isProcessing && (
                <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-amber-500" />
              )}
              {statusConfig.text}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Delete dataset"
              onClick={(e) => handleDelete(e, dataset.id)}
              className="size-8 shrink-0 rounded-xl border-white/25 bg-white/92 text-red-500 shadow-md backdrop-blur-md hover:bg-red-50 hover:text-red-600 dark:border-white/15 dark:bg-slate-950/65 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <TrashIcon className="size-3.5" />
            </Button>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 px-5 pb-3 pt-10">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-300/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-800/90 dark:shadow-md dark:shadow-black/30">
              <TypeIcon className={`size-5 ${iconClass}`} aria-hidden="true" />
            </div>
            <span className="rounded-full border border-slate-300/90 bg-slate-200/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-200">
              {dataType.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="relative z-[1] flex flex-1 flex-col bg-white px-5 pb-4 pt-4 dark:bg-slate-900">
          <h2 className="mb-3 truncate text-base font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
            {dataset.title || "Untitled Dataset"}
          </h2>

          {/* Divider */}
          <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-white/[0.12]" />

          {/* Metadata grid */}
          <div className="grid grid-cols-3 gap-3 text-[11px]">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">
                Created
              </span>
              <span className="truncate font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {createdAtDisplay}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">
                Files
              </span>
              <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {totalFiles.toLocaleString()}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">
                Size
              </span>
              <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">
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
