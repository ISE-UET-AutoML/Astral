import { useState } from "react";
import { Empty } from "src/components/ui/empty";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getConfidenceStatus = (conf: number) => {
  if (conf >= 0.9)
    return {
      label: "Excellent",
      icon: CheckCircle2,
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-300",
      bar: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      callout:
        "border-l-4 border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-300",
      message: "Highly confident prediction",
    };
  if (conf >= 0.75)
    return {
      label: "Good",
      icon: CheckCircle2,
      badge:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-300",
      bar: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      callout:
        "border-l-4 border-blue-400 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-300",
      message: "Good confidence level",
    };
  if (conf >= 0.6)
    return {
      label: "Medium",
      icon: AlertCircle,
      badge:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-300",
      bar: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      callout:
        "border-l-4 border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-900/20 dark:text-amber-300",
      message: "Moderate confidence",
    };
  return {
    label: "Low",
    icon: XCircle,
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-300",
    bar: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    callout:
      "border-l-4 border-red-400 bg-red-50 text-red-800 dark:border-red-500 dark:bg-red-900/20 dark:text-red-300",
    message: "Low confidence — review recommended",
  };
};

const ImageHistoryViewer = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return <Empty />;
  }

  const currentPrediction = data[currentIndex] || {};
  const confidence = currentPrediction.confidence || 0;
  const confidencePercent = (confidence * 100).toFixed(2);
  const confidencePct = parseFloat(confidencePercent);
  const status = getConfidenceStatus(confidence);
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
        <button
          type="button"
          onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
        >
          <ChevronLeft className="size-4" />
          Prev
        </button>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {currentIndex + 1}
          </span>{" "}
          / {data.length}
        </span>
        <button
          type="button"
          onClick={() =>
            setCurrentIndex((p) => Math.min(data.length - 1, p + 1))
          }
          disabled={currentIndex === data.length - 1}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Image */}
        <div className="md:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-white/10">
              <span className="w-1 h-4 rounded-full bg-blue-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Original Image
              </span>
            </div>
            <div className="flex h-80 items-center justify-center bg-gray-50 dark:bg-white/5">
              <img
                src={currentPrediction.imageUrl}
                alt={`Prediction ${currentPrediction.key}`}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Prediction results */}
        <div className="space-y-3">
          {/* Class */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-white/10">
              <span className="w-1 h-4 rounded-full bg-blue-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Class
              </span>
            </div>
            <div className="px-4 py-4">
              <span
                className={cx(
                  "inline-flex items-center rounded-lg border px-3 py-1 text-sm font-bold uppercase tracking-wide",
                  "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-900/20 dark:text-blue-300",
                )}
              >
                {currentPrediction.class?.toUpperCase() ?? "—"}
              </span>
            </div>
          </div>

          {/* Confidence */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-white/10">
              <span className="w-1 h-4 rounded-full bg-blue-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Confidence
              </span>
            </div>
            <div className="space-y-3 px-4 py-4">
              {/* Score + badge */}
              <div className="flex items-center justify-between">
                <div className={cx("text-3xl font-bold", status.text)}>
                  {confidencePercent}%
                </div>
                <span
                  className={cx(
                    "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold",
                    status.badge,
                  )}
                >
                  <StatusIcon className="size-3.5" />
                  {status.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                <div
                  className={cx(
                    "h-full rounded-full transition-all",
                    status.bar,
                  )}
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>

              {/* Callout */}
              <div
                className={cx(
                  "rounded-lg p-3 text-xs font-medium",
                  status.callout,
                )}
              >
                {status.message}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail gallery */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-white/10">
          <span className="w-1 h-4 rounded-full bg-blue-500 shrink-0" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Gallery
          </span>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
            {data.length} image{data.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 px-4 py-4">
          {data.map((pred, index) => {
            const thumbConf = pred.confidence || 0;
            const thumbStatus = getConfidenceStatus(thumbConf);
            const isActive = currentIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cx(
                  "relative shrink-0 overflow-hidden rounded-xl border-2 transition-all hover:scale-105",
                  isActive
                    ? "border-blue-500 ring-2 ring-blue-400/40 dark:ring-blue-500/30"
                    : "border-gray-200 opacity-70 hover:opacity-100 dark:border-white/20",
                )}
              >
                <img
                  src={pred.imageUrl}
                  alt={`Thumbnail ${pred.key}`}
                  className="size-16 object-cover"
                />
                <div
                  className={cx(
                    "absolute bottom-0 left-0 right-0 py-0.5 text-center text-xs font-bold text-white",
                    thumbStatus.bar,
                  )}
                >
                  {(thumbConf * 100).toFixed(0)}%
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageHistoryViewer;
