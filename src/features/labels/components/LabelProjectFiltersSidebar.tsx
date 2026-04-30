import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { ArrowRight, Sliders, Search, ArrowUp, ArrowDown } from "lucide-react";

const selectItemClass =
  "h-8 rounded-lg px-2.5 pr-8 text-sm text-gray-700 focus:bg-blue-50 focus:text-blue-700 dark:text-gray-200 dark:focus:bg-blue-500/15 dark:focus:text-blue-100";

export function LabelProjectFiltersSidebar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  serviceFilter,
  onServiceFilterChange,
  bucketFilter,
  onBucketFilterChange,
  labeledFilter,
  onLabeledFilterChange,
  selectedRowKey,
  onContinue,
}) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-white/10">
        <Sliders className="size-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Filter Options
        </span>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Search by Name
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 rounded-xl border-gray-200 bg-white pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Sort by */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Sort by
        </label>
        <div className="flex items-center gap-2">
          <Select
            value={sortBy ?? "__name__"}
            onValueChange={(v) => onSortByChange(v === "__name__" ? "name" : v)}
          >
            <SelectTrigger className="h-10 flex-1 rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className="z-[1100] rounded-xl border border-gray-200 bg-white p-1.5 dark:border-white/10 dark:bg-slate-950"
            >
              <SelectItem value="name" className={selectItemClass}>
                Name
              </SelectItem>
              <SelectItem value="date" className={selectItemClass}>
                Date Added
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")
            }
            className="size-10 shrink-0 rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
          >
            {sortDirection === "asc" ? (
              <ArrowUp className="size-4" />
            ) : (
              <ArrowDown className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Cloud Service */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Cloud Service
        </label>
        <Select
          value={serviceFilter || "__all__"}
          onValueChange={(v) => onServiceFilterChange(v === "__all__" ? "" : v)}
        >
          <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent
            align="start"
            position="popper"
            className="z-[1100] rounded-xl border border-gray-200 bg-white p-1.5 dark:border-white/10 dark:bg-slate-950"
          >
            <SelectItem value="__all__" className={selectItemClass}>
              All Services
            </SelectItem>
            <SelectItem value="AWS_S3" className={selectItemClass}>
              Amazon S3
            </SelectItem>
            <SelectItem value="GCP_STORAGE" className={selectItemClass}>
              Google Cloud Storage
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Storage Bucket */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Storage Bucket
        </label>
        <Select
          value={bucketFilter || "__all__"}
          onValueChange={(v) => onBucketFilterChange(v === "__all__" ? "" : v)}
        >
          <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white">
            <SelectValue placeholder="All Buckets" />
          </SelectTrigger>
          <SelectContent
            align="start"
            position="popper"
            className="z-[1100] rounded-xl border border-gray-200 bg-white p-1.5 dark:border-white/10 dark:bg-slate-950"
          >
            <SelectItem value="__all__" className={selectItemClass}>
              All Buckets
            </SelectItem>
            <SelectItem
              value="user-private-project"
              className={selectItemClass}
            >
              User Private Project
            </SelectItem>
            <SelectItem value="bucket-1" className={selectItemClass}>
              Bucket 1
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Status */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Project Status
        </label>
        <div className="flex flex-col gap-2">
          {[
            { value: "", id: "all", label: "All Projects" },
            { value: "yes", id: "labeled", label: "Labeled" },
            { value: "no", id: "unlabeled", label: "Unlabeled" },
          ].map(({ value, id, label }) => {
            const isSelected = labeledFilter === value;
            return (
              <div
                key={id}
                className="flex cursor-pointer items-center gap-2.5"
                onClick={() => onLabeledFilterChange(value)}
              >
                <button
                  type="button"
                  id={id}
                  aria-checked={isSelected}
                  role="radio"
                  className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 dark:border-blue-500 dark:bg-blue-500"
                      : "border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400"
                  }`}
                >
                  {isSelected && (
                    <span className="block size-2 rounded-full bg-white" />
                  )}
                </button>
                <label
                  htmlFor={id}
                  className="cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                >
                  {label}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      {selectedRowKey && (
        <Button
          onClick={onContinue}
          className="h-10 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Go to Training
          <ArrowRight className="size-4" />
        </Button>
      )}
    </div>
  );
}
