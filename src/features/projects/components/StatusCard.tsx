import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Progress } from "src/components/ui/progress";
import { cn } from "src/lib/utils";

type StatusCardColor = {
  iconBg: string;
  iconText: string;
  valueText: string;
};

type StatusCardProps = {
  label: string;
  value: ReactNode;
  Icon: LucideIcon;
  color?: StatusCardColor;
  /** Line under the label row (e.g. "models ready") */
  footnote?: ReactNode;
  /** Shows "num / den" and optionally a progress bar (den > 0) */
  fraction?: { num: number; den: number };
  /** Left side of the fraction row (e.g. "of 7 experiments") */
  fractionLabel?: ReactNode;
  /** When false, only the fraction text row is shown (no bar) */
  showFractionBar?: boolean;
  /** Tailwind classes for the progress fill (e.g. bg-emerald-500) */
  progressIndicatorClassName?: string;
  size?: "default" | "lg";
};

const DEFAULT_COLOR: StatusCardColor = {
  iconBg: "bg-blue-100 dark:bg-blue-900/30",
  iconText: "text-blue-600 dark:text-blue-400",
  valueText: "text-gray-900 dark:text-white",
};

const StatusCard = ({
  label,
  value,
  Icon,
  color = DEFAULT_COLOR,
  footnote,
  fraction,
  fractionLabel,
  showFractionBar = true,
  progressIndicatorClassName = "[&_[data-slot=progress-indicator]]:bg-primary",
  size = "default",
}: StatusCardProps) => {
  const pct =
    fraction && fraction.den > 0
      ? Math.min(100, Math.round((fraction.num / fraction.den) * 100))
      : 0;

  const isLg = size === "lg";

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-gray-200 bg-white transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/40 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-700/40 dark:hover:bg-blue-950/20",
        isLg ? "gap-4 px-5 py-5 sm:px-6 sm:py-6" : "gap-0 px-4 py-4",
      )}
    >
      <div className={cn("flex items-center", isLg ? "gap-4" : "gap-4")}>
        <div
          className={cn(
            "flex-shrink-0 rounded-xl",
            isLg ? "p-3.5" : "p-2.5",
            color.iconBg,
          )}
        >
          <Icon className={cn(isLg ? "size-6" : "size-5", color.iconText)} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-medium text-gray-600 dark:text-gray-300",
              isLg ? "mb-1 text-sm" : "mb-0.5 text-xs",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "font-bold tabular-nums",
              isLg ? "text-3xl leading-none tracking-tight" : "text-2xl",
              color.valueText,
            )}
          >
            {value}
          </p>
          {footnote != null ? (
            <p
              className={cn(
                "mt-1.5 font-normal tabular-nums text-gray-700 dark:text-gray-300",
                isLg ? "text-sm" : "text-xs",
              )}
            >
              {footnote}
            </p>
          ) : null}
        </div>
      </div>

      {fraction != null && fraction.den > 0 ? (
        <div className={cn("space-y-1.5", isLg ? "mt-1" : "mt-3")}>
          <div className="flex items-center justify-between gap-2 text-xs tabular-nums text-gray-700 dark:text-gray-300">
            <span className="min-w-0 leading-snug">
              {fractionLabel ?? "Of total"}
            </span>
            <span className="shrink-0 font-semibold text-gray-900 dark:text-gray-100">
              {fraction.num} / {fraction.den}
            </span>
          </div>
          {showFractionBar ? (
            <Progress
              value={pct}
              className={cn(
                "h-2 bg-gray-100 dark:bg-white/10",
                isLg && "h-2.5",
                progressIndicatorClassName,
              )}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default StatusCard;
