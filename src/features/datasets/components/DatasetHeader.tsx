import { Plus } from "lucide-react";
import { Button } from "src/components/ui/button";

const DatasetHeader = ({ onNewDataset }: { onNewDataset: () => void }) => {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Datasets
        </h1>
        <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          Upload and manage your datasets for machine learning projects.
        </p>
      </div>
      <Button
        onClick={onNewDataset}
        className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        <Plus className="size-4" />
        New Dataset
      </Button>
    </div>
  );
};

export default DatasetHeader;
