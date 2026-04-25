import type { ChangeEvent } from 'react'
import { X as XMarkIcon } from 'lucide-react'

const statusOptions = [
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'CREATING_DATASET', label: 'Creating Dataset' },
  { value: 'CREATING_LABEL_PROJECT', label: 'Creating Label Project' },
  { value: 'FAILED', label: 'Failed' },
]

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
]

const typeFilterOptions = [
  { value: 'None', label: 'None' },
  { value: 'TEXT', label: 'Text' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'TABULAR', label: 'Tabular' },
  { value: 'MULTIMODAL', label: 'Multimodal' },
]

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
  onStatusChange,
  onReset,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}: DatasetFilterProps) => {
  const handleSelectChange = (handler?: (value: string) => void) =>
    (event: ChangeEvent<HTMLSelectElement>) => handler?.(event.target.value)

  return (
    <div className="mb-6 p-4 rounded-xl backdrop-blur-sm bg-gray-50/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Search:</span>
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchTerm || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all"
          />
        </div>

        {/* Type */}
        <div className="flex items-center gap-2 h-10">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Type:</span>
          <div className="w-36">
            <select
              value={selectedType || 'none'}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              onChange={handleSelectChange(onTypeChange)}
            >
              {typeFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 h-10">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Sort by:</span>
          <div className="w-32">
            <select
              value={sortBy || 'latest'}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              onChange={handleSelectChange(onSortChange)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reset */}
      {(selectedStatus || searchTerm !== '' || sortBy !== 'latest' || selectedType !== null) && (
        <div className="flex justify-end pt-3">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-all duration-200 text-gray-700 dark:text-gray-300 bg-blue-500/5 dark:bg-blue-400/10 hover:bg-blue-500/10 dark:hover:bg-blue-400/20 border border-gray-200 dark:border-white/10"
          >
            <XMarkIcon className="h-4 w-4" />
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}

export default DatasetFilter
