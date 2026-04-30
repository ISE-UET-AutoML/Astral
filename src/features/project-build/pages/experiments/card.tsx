import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PATHS } from "src/constants/paths";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "src/components/ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  Beaker,
} from "lucide-react";

dayjs.extend(relativeTime);

type Experiment = {
  id: number;
  project_id: string;
  name: string;
  start_time?: string;
  status: string;
  framework?: string;
};

const STATUS_CONFIG: Record<string, {
  label: string;
  badge: string;
  bar: string;
  iconColor: string;
  icon: React.ReactNode;
}> = {
  DONE: {
    label: "Completed",
    badge:
      "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    bar: "border-emerald-400/50",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    icon: <CheckCircle2 className="size-5" />,
  },
  TRAINING: {
    label: "Training",
    badge:
      "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
    bar: "border-amber-400/50",
    iconColor: "text-amber-500 dark:text-amber-400",
    icon: <Loader2 className="size-5 animate-spin" />,
  },
  SETTING_UP: {
    label: "Setting Up",
    badge:
      "rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    bar: "border-blue-400/50",
    iconColor: "text-blue-500 dark:text-blue-400",
    icon: <Settings className="size-5" />,
  },
  CREATING_INSTANCE: {
    label: "Setting Up",
    badge:
      "rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    bar: "border-blue-400/50",
    iconColor: "text-blue-500 dark:text-blue-400",
    icon: <Settings className="size-5" />,
  },
  FAILED: {
    label: "Failed",
    badge:
      "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400",
    bar: "border-red-400/50",
    iconColor: "text-red-500 dark:text-red-400",
    icon: <AlertCircle className="size-5" />,
  },
};

const DEFAULT_STATUS = {
  label: "Unknown",
  badge:
    "rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-white/10 dark:text-gray-400",
  bar: "border-gray-200 dark:border-white/10",
  iconColor: "text-gray-500 dark:text-gray-400",
  icon: <Beaker className="size-5" />,
};

export default function ExperimentCard({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { id, project_id, name, start_time, status, framework } = experiment;
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[status] ?? DEFAULT_STATUS;
  const isClickable = status !== "FAILED";

  const handleCardClick = () => {
    if (status === "FAILED") {
      toast.error("This experiment failed and cannot be viewed.");
      return;
    }
    navigate(
      status === "DONE"
        ? PATHS.PROJECT_TRAININGRESULT(project_id, id, name)
        : PATHS.PROJECT_TRAINING(project_id, id, name),
    );
  };

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow transition duration-300 dark:bg-slate-900 ${cfg.bar} ${isClickable ? "cursor-pointer hover:-translate-y-1 hover:shadow-md" : "cursor-default opacity-75"}`}
      onClick={handleCardClick}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full shrink-0 ${
          status === "DONE"
            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
            : status === "FAILED"
              ? "bg-gradient-to-r from-red-500 to-red-400"
              : status === "TRAINING"
                ? "bg-gradient-to-r from-amber-500 to-amber-400"
                : "bg-gradient-to-r from-blue-500 to-blue-400"
        }`}
      />

      <div className="flex flex-1 flex-col px-5 py-4">
        {/* Icon + status */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:border-white/10 dark:from-blue-500/15 dark:to-blue-600/10">
            <span className={cfg.iconColor}>{cfg.icon}</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge className={cfg.badge}>
              {(status === "TRAINING" ||
                status === "SETTING_UP" ||
                status === "CREATING_INSTANCE") && (
                <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-current" />
              )}
              {cfg.label}
            </Badge>
            <span className="rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
              ID: {id}
            </span>
          </div>
        </div>

        {/* Name */}
        <h2 className="mb-1 truncate text-base font-bold leading-tight text-gray-900 dark:text-white">
          {name}
        </h2>

        {/* Divider */}
        <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-white/10" />

        {/* Meta */}
        <div className="flex flex-col gap-2 text-xs">
          {start_time && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 dark:text-gray-500">Started</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {dayjs(start_time).fromNow()}
              </span>
            </div>
          )}
          {framework && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 dark:text-gray-500">Framework</span>
              <span className="font-semibold capitalize text-gray-800 dark:text-gray-200">
                {framework.toLowerCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
