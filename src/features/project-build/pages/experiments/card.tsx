import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PATHS } from "src/constants/paths";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  CheckCircle,
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

type StatusConfig = {
  iconColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badge: string;
  icon: React.ReactNode;
};

// Define status colors and styles
const getStatusConfig = (status: string): StatusConfig => {
  switch (status) {
    case "DONE":
      return {
        iconColor: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
        borderColor: "border-emerald-200 dark:border-emerald-700",
        textColor: "text-emerald-700 dark:text-emerald-400",
        icon: <CheckCircle className="h-6 w-6" />,
        badge: "Completed",
      };
    case "TRAINING":
      return {
        iconColor: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-950/20",
        borderColor: "border-amber-200 dark:border-amber-700",
        textColor: "text-amber-700 dark:text-amber-400",
        icon: <Loader2 className="h-6 w-6 animate-spin" />,
        badge: "Training",
      };
    case "SETTING_UP":
    case "CREATING_INSTANCE":
      return {
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-blue-200 dark:border-blue-700",
        textColor: "text-blue-700 dark:text-blue-400",
        icon: <Settings className="h-6 w-6" />,
        badge: "Setting Up",
      };
    case "FAILED":
      return {
        iconColor: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-red-200 dark:border-red-700",
        textColor: "text-red-700 dark:text-red-400",
        icon: <AlertCircle className="h-6 w-6" />,
        badge: "Failed",
      };
    default:
      return {
        iconColor: "text-gray-500",
        bgColor: "bg-gray-50 dark:bg-gray-950/20",
        borderColor: "border-gray-200 dark:border-gray-700",
        textColor: "text-gray-700 dark:text-gray-400",
        icon: <Beaker className="h-6 w-6" />,
        badge: "Unknown",
      };
  }
};

export default function ExperimentCard({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { id, project_id, name, start_time, status, framework } = experiment;
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(status);

  // Handle card click
  const handleCardClick = () => {
    if (status === "FAILED") {
      toast.error("Failed experiment");
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
      className="group cursor-pointer rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:scale-105 hover:border-gray-400 dark:hover:border-gray-600"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`rounded-xl p-3 ${statusConfig.bgColor}`}>
          <div className={statusConfig.iconColor}>{statusConfig.icon}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div
            className={`rounded-full border px-3 py-1 text-xs font-medium ${statusConfig.borderColor} ${statusConfig.bgColor} ${statusConfig.textColor}`}
          >
            {statusConfig.badge}
          </div>
          <div className="rounded bg-gray-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
            ID: {id}
          </div>
        </div>
      </div>

      <div className="pt-0">
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white transition-colors">
          {name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {start_time && (
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-600"></span>
              Created {dayjs(start_time).fromNow()}
            </p>
          )}
          {framework && (
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-600"></span>
              Framework: {framework.toLowerCase()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
