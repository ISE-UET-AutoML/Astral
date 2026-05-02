import ModelCard from "./card";
import { useEffect, useState, useCallback } from "react";
import { getModels } from "src/features/models/api/model";
import { useParams } from "react-router-dom";
import { Network, Brain } from "lucide-react";
import { Spinner } from "src/components/ui/spinner";
import { PageHeading } from "src/components/ui/page-heading";

export default function ProjectModels() {
  const { id: projectId } = useParams();
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getListModels = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const { data } = await getModels(projectId);
      const sortedData = data.sort((a, b) => b.id - a.id);
      setModels(sortedData);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    getListModels();
  }, [getListModels]);

  return (
    <div className="w-full px-6 py-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <PageHeading
          className="mb-0"
          icon={Brain}
          title="Models"
          description={
            models.length > 0
              ? `${models.length} model${models.length !== 1 ? "s" : ""}`
              : "Train experiments to generate models"
          }
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-52 items-center justify-center">
          <Spinner className="size-6 text-blue-500" />
        </div>
      ) : models.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={{ ...model, project_id: projectId }}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white/70 text-center dark:border-white/10 dark:bg-white/5">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
            <Network className="size-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              No models yet
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Train an experiment to generate your first model.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
