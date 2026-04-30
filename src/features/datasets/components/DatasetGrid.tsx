import { Database, Plus } from "lucide-react";
import { Spinner } from "src/components/ui/spinner";
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
  if (isLoading) {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <Spinner className="size-6 text-blue-500" />
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white/70 text-center dark:border-white/10 dark:bg-white/5">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
          <Database className="size-6 text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            No datasets yet
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create your first dataset to get started.
          </p>
        </div>
        <Button
          onClick={onCreateDataset}
          className="h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          <Plus className="size-4" />
          Create Dataset
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {datasets.map((dataset) => (
        <DatasetCard
          key={dataset.id}
          dataset={dataset}
          onDelete={onDelete}
          isDeleting={deletingIds.has(dataset.id)}
        />
      ))}
    </div>
  );
};

export default DatasetGrid;
