import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StatusCardColor = {
  /** Tailwind bg class for the icon container, e.g. "bg-emerald-100 dark:bg-emerald-900/30" */
  iconBg: string;
  /** Tailwind text class for the icon, e.g. "text-emerald-600 dark:text-emerald-400" */
  iconText: string;
  /** Tailwind text class for the value label, e.g. "text-emerald-700 dark:text-emerald-400" */
  valueText: string;
};

type StatusCardProps = {
  label: string;
  value: ReactNode;
  Icon: LucideIcon;
  color?: StatusCardColor;
};

const DEFAULT_COLOR: StatusCardColor = {
  iconBg: "bg-blue-100 dark:bg-blue-900/30",
  iconText: "text-blue-600 dark:text-blue-400",
  valueText: "text-gray-900 dark:text-white",
};

const StatusCard = ({ label, value, Icon, color = DEFAULT_COLOR }: StatusCardProps) => (
  <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/40 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-700/40 dark:hover:bg-blue-950/20">
    <div className={`flex-shrink-0 rounded-xl p-2.5 ${color.iconBg}`}>
      <Icon className={`size-5 ${color.iconText}`} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="mb-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${color.valueText}`}>{value}</p>
    </div>
  </div>
);

export default StatusCard;
