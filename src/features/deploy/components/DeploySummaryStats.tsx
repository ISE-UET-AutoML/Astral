import { Clock, Hourglass } from "lucide-react";
import dayjs from "dayjs";

function StatCard({ icon, label, value, sub, accentClass }) {
  return (
    <div className="flex flex-1 items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-white/10 dark:bg-slate-900">
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${accentClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="truncate text-2xl font-bold leading-none text-gray-900 dark:text-white">
          {value}
        </p>
        {sub && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

export function DeploySummaryStats({ deployData, recentPredictions }) {
  if (!deployData) return null;

  const createTime = deployData?.create_time ?? deployData?.created_at;
  const minutesDiff = createTime ? dayjs().diff(dayjs(createTime), "minute") : 0;
  const hours = Math.floor(minutesDiff / 60);
  const minutes = minutesDiff % 60;

  const uptimeValue = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
  const totalPredictions = recentPredictions?.length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <StatCard
        icon={<Clock className="size-5" />}
        label="Uptime"
        value={uptimeValue}
        sub={createTime ? `Since ${dayjs(createTime).format("MMM D, HH:mm")}` : null}
        accentClass="bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"
      />
      <StatCard
        icon={<Hourglass className="size-5" />}
        label="Total Predictions"
        value={totalPredictions.toLocaleString()}
        sub={
          totalPredictions === 0
            ? "No predictions yet"
            : `${totalPredictions} request${totalPredictions > 1 ? "s" : ""} served`
        }
        accentClass="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
      />
    </div>
  );
}
