import { useNavigate } from "react-router-dom";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import {
  Cloud,
  CheckCircle2,
  Clock,
  Rocket,
  Square,
  Zap,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PATHS } from "src/constants/paths";

dayjs.extend(relativeTime);

type DeployStatus = "onCloud" | "inProduction" | "ONLINE" | "OFFLINE" | "SETTING_UP" | string;

const STATUS_CONFIG: Record<string, {
  label: string;
  badge: string;
  bar: string;
  icon: React.ReactNode;
}> = {
  onCloud: {
    label: "Ready for Deployment",
    badge:
      "rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    bar: "border-blue-400/50",
    icon: <Cloud className="size-5" />,
  },
  inProduction: {
    label: "Live in Production",
    badge:
      "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    bar: "border-emerald-400/50",
    icon: <CheckCircle2 className="size-5" />,
  },
  ONLINE: {
    label: "Online",
    badge:
      "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    bar: "border-emerald-400/50",
    icon: <CheckCircle2 className="size-5" />,
  },
  OFFLINE: {
    label: "Offline",
    badge:
      "rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-white/10 dark:text-gray-400",
    bar: "border-gray-200 dark:border-white/10",
    icon: <Square className="size-5" />,
  },
  SETTING_UP: {
    label: "Setting Up",
    badge:
      "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
    bar: "border-amber-400/50",
    icon: <Zap className="size-5" />,
  },
};

const DEFAULT_STATUS = {
  label: "Processing",
  badge:
    "rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-white/10 dark:text-gray-400",
  bar: "border-gray-200 dark:border-white/10",
  icon: <Clock className="size-5" />,
};

export default function ModelCard({ model }) {
  const {
    id,
    name,
    deployStatus,
    createdAt,
    project_id,
    experiment_id,
    experiment_name: experimentName,
  } = model;

  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[deployStatus] ?? DEFAULT_STATUS;

  const handleCardClick = () => {
    navigate(PATHS.MODEL_VIEW(project_id, id));
  };

  const handleDeploy = (e) => {
    e.stopPropagation();
    navigate(
      `/app/project/${project_id}/build/deployView?experimentName=${experiment_id}`,
    );
  };

  const handleStop = (e) => {
    e.stopPropagation();
    console.log(`Stopping model ${id}`);
  };

  const handleRedeploy = (e) => {
    e.stopPropagation();
    console.log(`Redeploying model ${id}`);
  };

  return (
    <div
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow transition duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-900 ${cfg.bar}`}
      onClick={handleCardClick}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full shrink-0 ${
          deployStatus === "inProduction" || deployStatus === "ONLINE"
            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
            : deployStatus === "onCloud"
              ? "bg-gradient-to-r from-blue-500 to-blue-400"
              : "bg-gradient-to-r from-gray-300 to-gray-200 dark:from-white/20 dark:to-white/10"
        }`}
      />

      <div className="flex flex-1 flex-col px-5 py-4">
        {/* Icon + status */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:border-white/10 dark:from-blue-500/15 dark:to-blue-600/10">
            <span className="text-blue-500 dark:text-blue-400">{cfg.icon}</span>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge className={cfg.badge}>{cfg.label}</Badge>
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
        <div className="mb-4 flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
          {experimentName && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 dark:text-gray-500">Experiment</span>
              <span className="max-w-[140px] truncate text-right font-semibold text-gray-800 dark:text-gray-200">
                {experimentName}
              </span>
            </div>
          )}
          {createdAt && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 dark:text-gray-500">Created</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {dayjs(createdAt).fromNow()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {(deployStatus === "onCloud" || deployStatus === "inProduction") && (
          <div className="flex gap-2">
            {deployStatus === "onCloud" && (
              <Button
                size="sm"
                onClick={handleDeploy}
                className="h-8 flex-1 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
              >
                <Rocket className="size-3.5" />
                Deploy
              </Button>
            )}
            {deployStatus === "inProduction" && (
              <>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleStop}
                  className="h-8 flex-1 rounded-xl px-3 text-xs font-semibold"
                >
                  <Square className="size-3.5" />
                  Stop
                </Button>
                <Button
                  size="sm"
                  onClick={handleRedeploy}
                  className="h-8 flex-1 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Redeploy
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
