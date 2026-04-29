import { useId } from "react";
import { Database } from "lucide-react";
import { Button } from "src/components/ui/button";
import DatasetCard from "./DatasetCard";
const DatasetGrid = ({
  datasets,
  getDatasets,
  onCreateDataset,
  onDelete,
  deletingIds,
  isLoading,
}) => {
  const datasetGradientId = `dataset-grad-${useId().replace(/:/g, "")}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-b-[var(--accent-text)]" />
          <p className="font-poppins text-[var(--text)]">Loading datasets...</p>
        </div>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 select-none">
        <Button
          variant="ghost"
          onClick={onCreateDataset}
          aria-label="Create new dataset"
          className="group relative h-auto min-h-36 w-auto shrink-0 gap-0 rounded-3xl border-0 bg-transparent p-0 text-inherit hover:bg-transparent dark:hover:bg-transparent focus-visible:border-transparent focus-visible:ring-cyan-500/50"
        >
          <span className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-400/10 scale-125 animate-ping [animation-duration:2.8s] group-hover:bg-blue-400/20" />
								{/* Mid glow ring */}
					<span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/10 scale-110 blur-xl group-hover:scale-125 transition-transform duration-500" />
								{/* Icon card */}
          <span className="relative flex items-center justify-center w-36 h-36 rounded-3xl bg-white dark:bg-[#1c1c24] shadow-[0_8px_40px_rgba(6,182,212,0.25)] dark:shadow-[0_8px_48px_rgba(6,182,212,0.18)] ring-1 ring-black/5 dark:ring-white/8 group-hover:-translate-y-2 group-hover:shadow-[0_20px_56px_rgba(6,182,212,0.38)] dark:group-hover:shadow-[0_20px_56px_rgba(6,182,212,0.3)] transition-all duration-300 ease-out">
            <svg width="0" height="0" className="pointer-events-none absolute size-0 overflow-hidden" aria-hidden>
              <defs>
                <linearGradient
                  id={datasetGradientId}
                  x1="0"
                  y1="12"
                  x2="24"
                  y2="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#00C2FF" />
                  <stop offset="100%" stopColor="#4E54F3" />
                </linearGradient>
              </defs>
            </svg>
            <Database
              className="size-14 drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-300"
              stroke={`url(#${datasetGradientId})`}
              strokeWidth={1.75}
              fill="none"
              aria-hidden
            />
          </span>
        </Button>

        <div className="mt-8 text-center space-y-2">
          <p className="text-xl font-semibold tracking-tight text-gray-800 dark:text-white">
            No Datasets Yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
            Click the icon or use <span className="font-medium text-blue-500">New Dataset</span> to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {datasets.map((dataset) => (
          <div key={dataset.id} className="flex">
            <DatasetCard
              dataset={dataset}
              onDelete={onDelete}
              isDeleting={deletingIds.has(dataset.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default DatasetGrid;
