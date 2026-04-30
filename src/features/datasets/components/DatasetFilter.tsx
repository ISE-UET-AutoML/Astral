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

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
];

const typeFilterOptions = [
  { value: "None", label: "None" },
  { value: "TEXT", label: "Text" },
  { value: "IMAGE", label: "Image" },
  { value: "TABULAR", label: "Tabular" },
  { value: "MULTIMODAL", label: "Multimodal" },
];

const selectTriggerClassName =
  "h-10 w-full rounded-xl border-gray-200 bg-white px-3 text-gray-900  hover:border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-slate-950/70 dark:text-white dark:hover:border-blue-400/40";

const selectContentClassName =
  "z-50 rounded-xl border border-gray-200 bg-white p-1.5 text-gray-900  ring-0 dark:border-white/10 dark:bg-slate-950 dark:text-white ";

const selectItemClassName =
  "h-8 rounded-lg px-2.5 pr-8 text-sm text-gray-700 focus:bg-blue-50 focus:text-blue-700 data-highlighted:bg-blue-50 data-highlighted:text-blue-700 data-[state=checked]:bg-blue-50 data-[state=checked]:font-medium data-[state=checked]:text-blue-700 dark:text-gray-200 dark:focus:bg-blue-500/15 dark:focus:text-blue-100 dark:data-highlighted:bg-blue-500/15 dark:data-highlighted:text-blue-100 dark:data-[state=checked]:bg-blue-500/15 dark:data-[state=checked]:text-blue-100";

type DatasetFilterProps = {
  selectedType?: string | null;
  onTypeChange?: (value: string) => void;
  selectedStatus?: string | null;
  onStatusChange?: (value: string) => void;
  onReset: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
};

const DatasetFilter = ({
  selectedType,
  onTypeChange,
  selectedStatus,
  onReset,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}: DatasetFilterProps) => {
  const hasActiveFilters =
    Boolean(selectedStatus) ||
    Boolean(searchTerm) ||
    (sortBy ?? "latest") !== "latest" ||
    Boolean(selectedType);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-64 flex-1">
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm ?? ""}
              onChange={(event) => onSearchChange?.(event.target.value)}
              className="h-10 rounded-xl border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="w-full sm:w-40">
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Type
          </label>
          <Select
            value={selectedType ?? "None"}
            onValueChange={(value) => onTypeChange?.(value)}
          >
            <SelectTrigger className={selectTriggerClassName}>
              <SelectValue placeholder="Dataset type" />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className={selectContentClassName}
            >
              {typeFilterOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={selectItemClassName}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-36">
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Sort by
          </label>
          <Select
            value={sortBy ?? "latest"}
            onValueChange={(value) => onSortChange?.(value)}
          >
            <SelectTrigger className={selectTriggerClassName}>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className={selectContentClassName}
            >
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={selectItemClassName}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

export default DatasetFilter;
