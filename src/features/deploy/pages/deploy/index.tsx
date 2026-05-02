import DeployedModelCard from "./card";
import { useEffect, useState, useCallback } from "react";
import { getAllDeployedModel } from "src/features/deploy/api/deploy";
import { useParams } from "react-router-dom";
import { Button } from "src/components/ui/button";
import { Rocket, Search, Layers } from "lucide-react";
import { Spinner } from "src/components/ui/spinner";
import { PageHeading } from "src/components/ui/page-heading";
import { projectPageShellScrollClass } from "src/layouts/project-page-shell";

const ProjectDeploy = () => {
  const { id: projectId } = useParams();
  const [deployedModels, setDeployedModels] = useState([]);
  const [uniqueModels, setUniqueModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getListDeployedModels = useCallback(async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const { data } = await getAllDeployedModel(projectId);
      const sortedData = data.sort((a, b) => b.id - a.id);
      setDeployedModels(sortedData);
      setUniqueModels(
        Array.from(new Set(data.map((item) => item.model_id))) as string[],
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    getListDeployedModels();
  }, [getListDeployedModels]);

  const filteredDeployedModels = deployedModels.filter((item) => {
    const matchesModel = !selectedModelId || item.model_id === selectedModelId;
    const matchesSearch =
      !searchTerm ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.model_id).includes(searchTerm);
    return matchesModel && matchesSearch;
  });

  const hasActiveFilters = Boolean(selectedModelId) || Boolean(searchTerm);

  const handleReset = () => {
    setSelectedModelId(null);
    setSearchTerm("");
  };

  return (
    <div className={projectPageShellScrollClass}>
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <PageHeading
          className="mb-0"
          icon={Rocket}
          title="Deployments"
          description={
            deployedModels.length > 0
              ? `${deployedModels.length} deployed model${deployedModels.length !== 1 ? "s" : ""}`
              : "Manage your deployed models"
          }
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-52 items-center justify-center">
          <Spinner className="size-6 text-blue-500" />
        </div>
      ) : filteredDeployedModels.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDeployedModels.map((deployedModel) => (
            <DeployedModelCard
              key={deployedModel.id}
              deployedModel={deployedModel}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white/70 text-center dark:border-white/10 dark:bg-white/5">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
            <Layers className="size-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {hasActiveFilters ? "No results found" : "No deployments yet"}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {hasActiveFilters
                ? "Try adjusting your filters."
                : "Train a model and deploy it to see it here."}
            </p>
          </div>
          {hasActiveFilters && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-9 rounded-xl border-gray-200 px-4 text-sm dark:border-white/10 dark:text-gray-200"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDeploy;
