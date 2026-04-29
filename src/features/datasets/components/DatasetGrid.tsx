import newDatasetIcon from "src/assets/icon/new-dataset.png";
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
        <button
          onClick={onCreateDataset}
          className="group relative flex items-center justify-center focus:outline-none"
          aria-label="Create new dataset"
        >
          <span className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-400/10 scale-125 animate-ping [animation-duration:2.8s] group-hover:bg-blue-400/20" />
								{/* Mid glow ring */}
					<span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/10 scale-110 blur-xl group-hover:scale-125 transition-transform duration-500" />
								{/* Icon card */}
          <span className="relative flex items-center justify-center w-36 h-36 rounded-3xl bg-white dark:bg-[#1c1c24] shadow-[0_8px_40px_rgba(6,182,212,0.25)] dark:shadow-[0_8px_48px_rgba(6,182,212,0.18)] ring-1 ring-black/5 dark:ring-white/8 group-hover:-translate-y-2 group-hover:shadow-[0_20px_56px_rgba(6,182,212,0.38)] dark:group-hover:shadow-[0_20px_56px_rgba(6,182,212,0.3)] transition-all duration-300 ease-out">
            <img
              src={newDatasetIcon}
              alt="New dataset"
              className="w-14 h-14 object-contain drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-300"
            />
          </span>
        </button>

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
