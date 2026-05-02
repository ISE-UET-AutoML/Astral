import { Search, X } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { TrainingTask } from "src/constants/trainingTasks";

const trainingTaskOptions = Object.values(TrainingTask).map((task) => ({
  value: task,
  label: task.replace(/_/g, " "),
}));

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
];

const fieldLabelClass =
  "text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400";

const triggerClass =
  "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-slate-200/90 bg-white px-2.5 text-sm text-slate-900 shadow-none outline-none transition-colors data-[size=default]:h-9 hover:border-slate-300 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-slate-600/70 dark:bg-slate-800/30 dark:text-slate-100 dark:hover:border-slate-500 [&_svg]:size-4";

const contentClass =
  "z-[1100] rounded-lg border border-slate-200/90 bg-white p-1 text-sm text-slate-900 shadow-lg dark:border-slate-600/80 dark:bg-slate-950 dark:text-slate-100";

const itemClass =
  "min-h-9 rounded-md py-2 pl-2.5 pr-8 text-sm text-slate-700 focus:bg-blue-50 focus:text-blue-800 data-[state=checked]:bg-blue-50 data-[state=checked]:font-medium data-[state=checked]:text-blue-800 dark:text-slate-200 dark:focus:bg-blue-500/15 dark:focus:text-blue-100 dark:data-[state=checked]:bg-blue-500/15 dark:data-[state=checked]:text-blue-100";

type TaskFilterProps = {
  selectedTrainingTask: string | null;
  onTaskChange: (value: string) => void;
  onReset: () => void;
  onSearch: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
  isReset: boolean;
  searchValue: string;
};

const TaskFilter = ({
  selectedTrainingTask,
  onTaskChange,
  onReset,
  onSearch,
  selectedSort,
  onSortChange,
  isReset: _isReset,
  searchValue,
}: TaskFilterProps) => {
  const hasActiveFilters =
    Boolean(selectedTrainingTask) ||
    Boolean(searchValue) ||
    (selectedSort ?? "latest") !== "latest";

  return (
    <section className="mb-8" aria-labelledby="projects-filter-heading">
      <div className="rounded-2xl border border-gray-200/90 bg-white shadow-md ring-1 ring-black/[0.04] dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-lg dark:shadow-black/30 dark:ring-white/[0.06]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 dark:border-slate-700/50">
          <h2
            id="projects-filter-heading"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400"
          >
            Search & filter
          </h2>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 gap-1 border border-blue-200/80 bg-blue-400/15 px-2.5 text-xs font-semibold text-blue-700 shadow-none backdrop-blur-md hover:bg-blue-400/25 focus-visible:ring-blue-500/30 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-300 dark:hover:bg-blue-400/20"
            >
              <X className="size-3" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(10rem,12rem)_minmax(8.5rem,10rem)] lg:items-end lg:gap-3">
          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
            <label htmlFor="projects-search" className={fieldLabelClass}>
              Name
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                aria-hidden
              />
              <Input
                id="projects-search"
                type="text"
                placeholder="Filter projects…"
                value={searchValue || ""}
                onChange={(e) => onSearch(e.target.value)}
                className="h-9 rounded-lg border-slate-200/90 bg-white pl-8 pr-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-slate-600/70 dark:bg-slate-800/30 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span id="projects-filter-type-label" className={fieldLabelClass}>
              Type
            </span>
            <Select
              value={selectedTrainingTask ?? ""}
              onValueChange={(v) => onTaskChange(v)}
            >
              <SelectTrigger
                className={triggerClass}
                aria-labelledby="projects-filter-type-label"
              >
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent align="start" position="popper" className={contentClass}>
                {trainingTaskOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className={itemClass}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <span id="projects-filter-sort-label" className={fieldLabelClass}>
              Sort
            </span>
            <Select value={selectedSort ?? "latest"} onValueChange={(v) => onSortChange(v)}>
              <SelectTrigger
                className={triggerClass}
                aria-labelledby="projects-filter-sort-label"
              >
                <SelectValue placeholder="Latest" />
              </SelectTrigger>
              <SelectContent align="start" position="popper" className={contentClass}>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className={itemClass}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskFilter;
