import { Button } from "src/components/ui/button";
import { RefreshCw, ExternalLink, ScanSearch, AlignLeft, ImageIcon } from "lucide-react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const STATUS_CONFIG: Record<
  string,
  { dot: string; badge: string; label: string }
> = {
  pending: {
    dot: "bg-amber-400",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-300",
    label: "Pending",
  },
  running: {
    dot: "bg-blue-500",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-300",
    label: "Running",
  },
  generating: {
    dot: "bg-blue-500",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-300",
    label: "Generating",
  },
  generated: {
    dot: "bg-blue-500",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-300",
    label: "Generated",
  },
  deploying: {
    dot: "bg-amber-400",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-300",
    label: "Deploying",
  },
  deployed: {
    dot: "bg-emerald-500",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-300",
    label: "Deployed",
  },
  completed: {
    dot: "bg-emerald-500",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-300",
    label: "Completed",
  },
  failed: {
    dot: "bg-red-500",
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300",
    label: "Failed",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.badge,
      )}
    >
      <span className={cx("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
};

const AppIcon = ({ taskType }: { taskType?: string }) => {
  if (taskType?.includes("object")) {
    return <ScanSearch className="size-5" />;
  }
  if (taskType?.includes("text")) {
    return <AlignLeft className="size-5" />;
  }
  return <ImageIcon className="size-5" />;
};

const BLOCKING_STATUSES = ["pending", "running", "generating", "deploying"];

function AppCard({ app, onViewDetails, onRetry, isRetrying }) {
  const hasInstance = app?.instance_id && app?.host;
  const frontendUrl =
    hasInstance && app?.ports?.frontend
      ? `http://${app.host}:${app.ports.frontend}`
      : null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const isFailed = app?.status === "failed";
  const isBlocked = BLOCKING_STATUSES.includes(app?.status);

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:border-blue-200 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-500/40">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-gray-100 px-4 py-4 dark:border-white/10">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <AppIcon taskType={app?.task_type} />
          </div>
          <p
            className="truncate text-sm font-semibold text-gray-900 dark:text-white"
            title={app?.name}
          >
            {app?.name || `App #${app?.id}`}
          </p>
        </div>
        <StatusBadge status={app?.status} />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 py-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 dark:text-gray-400">Task:</span>
            <span className="capitalize text-gray-800 dark:text-gray-200">
              {app?.task_type?.replace(/_/g, " ") || "N/A"}
            </span>
          </div>
          {app?.model_id != null && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500 dark:text-gray-400">Model ID:</span>
              <span className="font-mono text-gray-800 dark:text-gray-200">
                {app.model_id}
              </span>
            </div>
          )}
          {app?.created_at && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500 dark:text-gray-400">Created:</span>
              <span className="text-gray-800 dark:text-gray-200">
                {formatDate(app.created_at)}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {isFailed && onRetry ? (
            <Button
              size="sm"
              onClick={() => onRetry(app)}
              disabled={isRetrying}
              className="h-8 flex-1 rounded-xl bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-500"
            >
              <RefreshCw className={cx("size-3.5", isRetrying && "animate-spin")} />
              Retry
            </Button>
          ) : (
            <>
              {frontendUrl && (
                <Button
                  size="sm"
                  onClick={() => window.open(frontendUrl, "_blank")}
                  className="h-8 flex-1 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  <ExternalLink className="size-3.5" />
                  Open App
                </Button>
              )}
              {onViewDetails && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(app)}
                  disabled={isBlocked}
                  className="h-8 flex-1 rounded-xl border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                >
                  Details
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppCard;
