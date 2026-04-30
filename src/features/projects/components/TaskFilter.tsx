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

const triggerClass =
  "h-10 w-full rounded-xl border-gray-200 bg-white text-sm text-gray-900 hover:border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-blue-400/40";

const contentClass =
  "z-[1100] rounded-xl border border-gray-200 bg-white p-1.5 text-gray-900 dark:border-white/10 dark:bg-slate-950 dark:text-white";

const itemClass =
  "h-8 rounded-lg px-2.5 pr-8 text-sm text-gray-700 focus:bg-blue-50 focus:text-blue-700 data-[state=checked]:bg-blue-50 data-[state=checked]:font-medium data-[state=checked]:text-blue-700 dark:text-gray-200 dark:focus:bg-blue-500/15 dark:focus:text-blue-100 dark:data-[state=checked]:bg-blue-500/15 dark:data-[state=checked]:text-blue-100";

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
  isReset,
  searchValue,
}: TaskFilterProps) => {
  const hasActiveFilters =
    Boolean(selectedTrainingTask) ||
    Boolean(searchValue) ||
    (selectedSort ?? "latest") !== "latest";

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="min-w-64 flex-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchValue || ""}
              onChange={(e) => onSearch(e.target.value)}
              className="h-10 rounded-xl border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Task type */}
        <div className="w-full sm:w-52">
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Type
          </label>
          <Select
            value={selectedTrainingTask ?? ""}
            onValueChange={(v) => onTaskChange(v)}
          >
            <SelectTrigger className={triggerClass}>
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

        {/* Sort */}
        <div className="w-full sm:w-44">
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Sort by
          </label>
          <Select
            value={selectedSort ?? "latest"}
            onValueChange={(v) => onSortChange(v)}
          >
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Sort by" />
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

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="h-10 rounded-xl border-gray-200 bg-white px-3 text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:border-blue-400/30 dark:hover:bg-blue-400/10 dark:hover:text-blue-200"
          >
            <X className="size-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskFilter;
