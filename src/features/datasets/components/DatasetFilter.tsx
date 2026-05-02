import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X as XMarkIcon } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";

const statusOptions = [
  { value: "COMPLETED", label: "Completed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "CREATING_DATASET", label: "Creating Dataset" },
  { value: "CREATING_LABEL_PROJECT", label: "Creating Label Project" },
  { value: "FAILED", label: "Failed" },
];

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

const fieldLabelClass =
  "text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400";

const LISTBOX_CLASS =
  "absolute z-[100] mt-1.5 max-h-60 w-full overflow-auto rounded-lg border border-slate-200/90 bg-white p-1 text-sm text-slate-900 shadow-lg ring-1 ring-slate-950/[0.06] dark:border-slate-600/80 dark:bg-slate-950 dark:text-slate-100 dark:ring-white/[0.06] [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.45)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.2)_transparent] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-0 [&::-webkit-scrollbar-thumb]:bg-slate-400/45 dark:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-corner]:bg-transparent";

const TRIGGER_CLASS =
  "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-slate-200/90 bg-white px-2.5 text-left text-sm text-slate-900 shadow-none outline-none transition-colors hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600/70 dark:bg-slate-800/30 dark:text-slate-100 dark:hover:border-slate-500 [&_svg]:size-4";

type Option = { value: string; label: string };

function FilterDropdown({
  idPrefix,
  options,
  value,
  onSelect,
}: {
  idPrefix: string;
  options: Option[];
  value: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerId = `${idPrefix}-trigger`;
  const listId = `${idPrefix}-listbox`;

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        id={triggerId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={TRIGGER_CLASS}
      >
        <span className="min-w-0 truncate">{selected.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition dark:text-slate-400 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={triggerId}
          className={LISTBOX_CLASS}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelect(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? "bg-blue-500/10 font-medium text-blue-800 dark:bg-blue-500/15 dark:text-blue-100"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

type DatasetFilterProps = {
  selectedType?: string | null;
  onTypeChange?: (value: string | null) => void;
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
  selectedStatus: _selectedStatus,
  onStatusChange: _onStatusChange,
  onReset,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}: DatasetFilterProps) => {
  const typeValue = selectedType == null ? "None" : selectedType;
  const sortValue = sortBy || "latest";

  const hasActiveFilters =
    Boolean(searchTerm) ||
    sortValue !== "latest" ||
    selectedType != null;

  return (
    <section className="mb-8" aria-labelledby="datasets-filter-heading">
      <div className="rounded-2xl border border-gray-200/90 bg-white shadow-md ring-1 ring-black/[0.04] dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-lg dark:shadow-black/30 dark:ring-white/[0.06]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 dark:border-slate-700/50">
          <h2
            id="datasets-filter-heading"
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
              <XMarkIcon className="size-3" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(10rem,12rem)_minmax(8.5rem,10rem)] lg:items-end lg:gap-3">
          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
            <label htmlFor="datasets-search" className={fieldLabelClass}>
              Name
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                aria-hidden
              />
              <Input
                id="datasets-search"
                type="text"
                placeholder="Filter datasets…"
                value={searchTerm || ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="h-9 rounded-lg border-slate-200/90 bg-white pl-8 pr-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-slate-600/70 dark:bg-slate-800/30 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span id="datasets-filter-type-label" className={fieldLabelClass}>
              Type
            </span>
            <FilterDropdown
              idPrefix="dataset-type-filter"
              options={typeFilterOptions}
              value={typeValue}
              onSelect={(v) => onTypeChange?.(v === "None" ? null : v)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span id="datasets-filter-sort-label" className={fieldLabelClass}>
              Sort
            </span>
            <FilterDropdown
              idPrefix="dataset-sort-filter"
              options={sortOptions}
              value={sortValue}
              onSelect={(v) => onSortChange?.(v)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatasetFilter;

export { statusOptions, sortOptions, typeFilterOptions };
