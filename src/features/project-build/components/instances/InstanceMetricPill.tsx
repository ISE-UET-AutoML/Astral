export function InstanceMetricPill({ value, suffix }) {
  return (
    <div className="flex shrink-0 min-w-[96px] items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
      <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-white">
        {value}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{suffix}</span>
    </div>
  );
}
