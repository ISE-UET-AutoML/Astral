import { Database } from "lucide-react";
import {
  Empty as UiEmpty,
  EmptyContent,
  EmptyDescription as UiEmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "src/components/ui/empty";
import DatasetCard from "./DatasetCard";
import { Button } from "src/components/ui/button";

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
      <UiEmpty className="min-h-[320px] border border-dashed border-[var(--border)] bg-white/70 dark:bg-white/5">
        <EmptyMedia variant="icon">
          <Database className="h-4 w-4" />
        </EmptyMedia>
        <EmptyTitle className="font-poppins text-2xl font-semibold text-[var(--text)]">
          No Datasets Yet
        </EmptyTitle>
        <UiEmptyDescription className="font-poppins text-sm text-[var(--secondary-text)]">
          Start by creating your first dataset
        </UiEmptyDescription>
        <EmptyContent>
          <Button
            size="sm"
            onClick={onCreateDataset}
            className="font-poppins border border-[var(--border)] [background:var(--button-gradient)] text-white"
          >
            Create Dataset
          </Button>
        </EmptyContent>
      </UiEmpty>
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
