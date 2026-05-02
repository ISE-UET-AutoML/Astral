import React, { useState } from "react";
import {
  Box as CubeTransparentIcon,
  Trash as TrashIcon,
  FileText as DocumentTextIcon,
  Image as PhotoIcon,
  Table as TableCellsIcon,
  Puzzle as PuzzlePieceIcon,
  TrendingUp as ArrowTrendingUpIcon,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PATHS } from "src/constants/paths";
import { deleteProject } from "src/features/projects/api/project";
import { Spinner } from "src/components/ui/spinner";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { toast } from "sonner";
import image_classification from "src/assets/images/image_classification.jpg";
import text_classification from "src/assets/images/text_classification.jpg";
import multilabel_text_classification from "src/assets/images/multilabel_text_classification.jpg";
import tabular_classification from "src/assets/images/tabular_classification.jpg";
import tabular_regression from "src/assets/images/tabular_regression.jpg";
import multilabel_tabular_classification from "src/assets/images/multilabel_tabular_classification.jpg";
import multimodal_classification from "src/assets/images/multimodal_classification.jpg";
import multilabel_image_classification from "src/assets/images/multilabel_image_classification.jpg";
import object_detection from "src/assets/images/object_detection.jpg";
import semantic_segmentation from "src/assets/images/semantic_segmentation.jpg";
import time_series_forecasting from "src/assets/images/time_series_forecasting.jpg";
import clustering from "src/assets/images/clustering.jpeg";
import anomaly_detection from "src/assets/images/anomaly_detection.JPG";
import audio_classification from "src/assets/images/audio_classification.jpeg";
import video_classification from "src/assets/images/video_classification.jpeg";

dayjs.extend(relativeTime);

const IMAGE_MAP: Record<string, string> = {
  IMAGE_CLASSIFICATION: image_classification,
  TEXT_CLASSIFICATION: text_classification,
  MULTILABEL_TEXT_CLASSIFICATION: multilabel_text_classification,
  TABULAR_CLASSIFICATION: tabular_classification,
  TABULAR_REGRESSION: tabular_regression,
  MULTILABEL_TABULAR_CLASSIFICATION: multilabel_tabular_classification,
  MULTIMODAL_CLASSIFICATION: multimodal_classification,
  MULTILABEL_IMAGE_CLASSIFICATION: multilabel_image_classification,
  OBJECT_DETECTION: object_detection,
  SEMANTIC_SEGMENTATION: semantic_segmentation,
  TIME_SERIES_FORECASTING: time_series_forecasting,
  CLUSTERING: clustering,
  ANOMALY_DETECTION: anomaly_detection,
  AUDIO_CLASSIFICATION: audio_classification,
  VIDEO_CLASSIFICATION: video_classification,
};

const STATUS_CONFIG = {
  Pending: {
    badge:
      "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
    topAccent: "bg-amber-400/90",
  },
  Training: {
    badge:
      "rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    topAccent: "bg-blue-400/90",
  },
  Completed: {
    badge:
      "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    topAccent: "bg-emerald-400/90",
  },
};

export default function ProjectCard({ project, getProjects }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e, projectID) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setIsDeleting(true);
        await deleteProject(projectID);
        toast.success("Project deleted successfully!");
        getProjects();
      } catch (error) {
        toast.error("Failed to delete project. Please try again.");
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const taskType = project?.task_type;
  const taskImage = IMAGE_MAP[taskType] || image_classification;

  let IconComponent = CubeTransparentIcon;
  if (taskType?.includes("TEXT")) IconComponent = DocumentTextIcon;
  else if (taskType?.includes("IMAGE")) IconComponent = PhotoIcon;
  else if (taskType?.includes("TABULAR")) IconComponent = TableCellsIcon;
  else if (taskType?.includes("SEGMENTATION")) IconComponent = PuzzlePieceIcon;
  else if (taskType?.includes("TIME_SERIES")) IconComponent = ArrowTrendingUpIcon;

  const runningCount =
    (project?.training_experiments || 0) + (project?.setting_experiments || 0);
  const doneCount = project?.done_experiments || 0;
  const totalExperiments = runningCount + doneCount;
  let projectStatus: keyof typeof STATUS_CONFIG = "Pending";
  if (runningCount > 0) projectStatus = "Training";
  else if (doneCount > 0) projectStatus = "Completed";

  const { badge: badgeClass, topAccent: topAccentClass } =
    STATUS_CONFIG[projectStatus];

  return (
    <div className="relative">
      <div
        className="flex min-h-[360px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-black/[0.04] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-lg dark:shadow-black/40 dark:ring-white/[0.06] dark:hover:shadow-2xl"
        onClick={() => {
          window.location.href = PATHS.PROJECT_INFO(project?.id);
        }}
      >
        <div
          className={`h-0.5 w-full shrink-0 ${topAccentClass}`}
          aria-hidden="true"
        />
        {/* Hero: image + overlays + icon row in one layer (no negative margin / sibling seam) */}
        <div className="relative aspect-[5/2] w-full min-h-[128px] max-h-[200px] shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900 sm:aspect-[2/1] sm:max-h-[220px]">
          <img
            src={taskImage}
            alt={taskType || "project type"}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover object-center"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/35 to-transparent dark:from-slate-900 dark:via-slate-900/40 dark:to-transparent"
            aria-hidden="true"
          />

          <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
            <Badge
              className={`border-0 shadow-md ring-1 ring-black/5 dark:ring-white/10 ${badgeClass}`}
            >
              {projectStatus === "Training" && (
                <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-blue-500" />
              )}
              {projectStatus}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Delete project"
              onClick={(e) => handleDelete(e, project.id)}
              disabled={isDeleting}
              className="size-8 shrink-0 rounded-xl border-white/25 bg-white/92 text-red-500 shadow-md backdrop-blur-md hover:bg-red-50 hover:text-red-600 dark:border-white/15 dark:bg-slate-950/65 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <TrashIcon className="size-3.5" />
            </Button>
          </div>

          {/* Icon + task type — pinned to hero bottom so body below is a clean rectangle */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 px-5 pb-3 pt-10">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-300/80 bg-white shadow-sm dark:border-white/10 dark:bg-slate-800/90 dark:shadow-md dark:shadow-black/30">
              <IconComponent
                className="size-5 text-blue-500 dark:text-blue-400"
                aria-hidden="true"
              />
            </div>
            <span className="rounded-full border border-slate-300/90 bg-slate-200/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-800 shadow-sm dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-200">
              {taskType?.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Card body — overlap hero by 1px to mask subpixel gap between stacked blocks */}
        <div className="relative z-[1] flex flex-1 flex-col bg-white px-5 pb-4 pt-4 dark:bg-slate-900">
          {/* Title + description */}
          <div className="flex-1">
            <h2 className="mb-1 truncate text-base font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
              {project?.name}
            </h2>
            <p className="mb-3 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {project?.description || "No description"}
            </p>
          </div>

          {/* Divider */}
          <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-white/[0.12]" />

          {/* Meta */}
          <div className="grid grid-cols-3 gap-3 text-[11px]">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">
                Created
              </span>
              <span className="truncate font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {dayjs(project?.created_at).format("MMM DD, YYYY")}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">
                Runs
              </span>
              <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {totalExperiments}
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">
                Done
              </span>
              <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {doneCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Deleting overlay */}
      {isDeleting && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/70 text-gray-600 backdrop-blur-[1px] dark:bg-slate-900/70 dark:text-gray-300">
          <Spinner className="size-8" />
          <span className="text-sm font-medium">Deleting…</span>
        </div>
      )}
    </div>
  );
}
