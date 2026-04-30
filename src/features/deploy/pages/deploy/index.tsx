import DeployedModelCard from "./card";
import { useEffect, useState, useCallback } from "react";
import { getAllDeployedModel } from "src/features/deploy/api/deploy";
import { useParams } from "react-router-dom";
import { Button } from "src/components/ui/button";
import { Layers, X, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Input } from "src/components/ui/input";
import { Spinner } from "src/components/ui/spinner";

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
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-slate-950">
      <div className="w-full px-6 py-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Deployments
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {deployedModels.length > 0
                ? `${deployedModels.length} deployed model${deployedModels.length !== 1 ? "s" : ""}`
                : "Manage your deployed models"}
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-end gap-3">
            {/* Search */}
            <div className="min-w-52 flex-1">
              <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300">
                Search
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search deployments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 rounded-xl border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Model ID filter */}
            <div className="w-full sm:w-60">
              <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-300">
                Model ID
              </label>
              <Select
                value={selectedModelId ?? "__all__"}
                onValueChange={(v) =>
                  setSelectedModelId(v === "__all__" ? null : v)
                }
              >
                <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white text-sm text-gray-900 hover:border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-blue-400/40">
                  <SelectValue placeholder="All models" />
                </SelectTrigger>
                <SelectContent
                  align="start"
                  position="popper"
                  className="z-[1100] rounded-xl border border-gray-200 bg-white p-1.5 text-gray-900 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  <SelectItem
                    value="__all__"
                    className="h-8 rounded-lg px-2.5 pr-8 text-sm text-gray-700 focus:bg-blue-50 focus:text-blue-700 dark:text-gray-200 dark:focus:bg-blue-500/15 dark:focus:text-blue-100"
                  >
                    All models
                  </SelectItem>
                  {uniqueModels.map((modelId) => (
                    <SelectItem
                      key={modelId}
                      value={modelId}
                      className="h-8 rounded-lg px-2.5 pr-8 text-sm text-gray-700 focus:bg-blue-50 focus:text-blue-700 data-[state=checked]:bg-blue-50 data-[state=checked]:font-medium data-[state=checked]:text-blue-700 dark:text-gray-200 dark:focus:bg-blue-500/15 dark:focus:text-blue-100 dark:data-[state=checked]:bg-blue-500/15 dark:data-[state=checked]:text-blue-100"
                    >
                      Model {modelId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="h-10 rounded-xl border-gray-200 bg-white px-3 text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:border-blue-400/30 dark:hover:bg-blue-400/10 dark:hover:text-blue-200"
              >
                <X className="size-4" />
                Reset
              </Button>
            )}
          </div>
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
    </div>
  );
};

export default ProjectDeploy;
