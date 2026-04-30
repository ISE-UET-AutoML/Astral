import ExperimentCard from "./card";
import { useEffect, useState, useCallback } from "react";
import { getAllExperiments } from "src/features/project-build/api/experiment";
import { useParams } from "react-router-dom";
import { Beaker } from "lucide-react";
import { Spinner } from "src/components/ui/spinner";

type Experiment = {
  id: number;
  [key: string]: any;
};

export default function ProjectExperiments() {
  const { id: projectId } = useParams();
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getListExperiments = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const { data } = await getAllExperiments(projectId);
      const sortedData = data.sort(
        (a: Experiment, b: Experiment) => b.id - a.id,
      );
      setExperiments(sortedData);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    getListExperiments();
  }, [getListExperiments]);

  return (
    <div className="w-full px-6 py-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Experiments
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {experiments.length > 0
              ? `${experiments.length} experiment${experiments.length !== 1 ? "s" : ""}`
              : "Run training jobs to see experiments here"}
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-52 items-center justify-center">
          <Spinner className="size-6 text-blue-500" />
        </div>
      ) : experiments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {experiments.map((experiment) => (
            <ExperimentCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white/70 text-center dark:border-white/10 dark:bg-white/5">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
            <Beaker className="size-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              No experiments yet
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start a training job to create your first experiment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
