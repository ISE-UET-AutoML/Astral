import ExperimentCard from "./card";
import { useEffect, useState, useCallback } from "react";
import { getAllExperiments } from "src/features/project-build/api/experiment";
import { useParams } from "react-router-dom";
import { useTheme } from "src/theme/ThemeProvider";
import { Beaker, FileX } from "lucide-react";

type Experiment = {
  id: number;
  [key: string]: any;
};

export default function ProjectExperiments() {
  const { id: projectId } = useParams();
  const { theme } = useTheme();
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  const getListExperiments = useCallback(async () => {
    if (!projectId) return;
    const { data } = await getAllExperiments(projectId);
    const sortedData = data.sort((a: Experiment, b: Experiment) => b.id - a.id);
    setExperiments(sortedData);
  }, [projectId]);

  useEffect(() => {
    getListExperiments();
  }, [getListExperiments]);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-slate-950">
      <div className="relative z-10 w-full px-3 py-6 sm:px-4 lg:px-6 lg:py-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 dark:bg-blue-600 p-2">
              <Beaker className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Experiments
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {experiments.length} Experiments
              </p>
            </div>
          </div>
        </div>

        {/* Experiments List */}
        {experiments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {experiments.map((experiment) => (
              <ExperimentCard key={experiment.id} experiment={experiment} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 p-12">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 rounded-full bg-gray-100 dark:bg-slate-800 p-4">
                <FileX className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                No Experiments
              </h3>
              <p className="max-w-md text-center text-gray-600 dark:text-gray-400">
                You haven't run any experiments yet. Start by training a model
                to create your first experiment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
