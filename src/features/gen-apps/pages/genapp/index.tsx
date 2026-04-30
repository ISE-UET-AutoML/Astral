import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllDeployedModel,
  genApp,
  getDeployData,
} from "src/features/deploy/api/deploy";
import { initDraft } from "src/features/gen-apps/api/workspace";
import { getProjectById } from "src/features/projects/api/project";
import { getLatestModelVersionByModelId } from "src/features/models/api/model_version";
import { useGenApps } from "src/features/gen-apps/hooks/useGenApps";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "src/components/ui/dialog";
import { Spinner } from "src/components/ui/spinner";
import { toast } from "sonner";
import { PATHS } from "src/constants/paths";
import AppCard from "src/features/gen-apps/components/AppCard";
import { Network, Rocket } from "lucide-react";

const PAGE_SIZE = 8;

export default function ProjectGenApp() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { apps, loading, error, total, page, setPage, refetch } = useGenApps(
    projectId,
    1,
    PAGE_SIZE,
  );
  const [projectInfo, setProjectInfo] = useState(null);
  const [deploys, setDeploys] = useState([]);
  const [selectedDeployId, setSelectedDeployId] = useState<string | null>(null);
  const selectedModelId =
    deploys.find((d) => d.id === Number(selectedDeployId))?.model_id ?? null;
  const [genLoading, setGenLoading] = useState(false);
  const [appName, setAppName] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modelMetadata, setModelMetadata] = useState(null);
  const [selectedDeploy, setSelectedDeploy] = useState(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchDeploys = useCallback(async () => {
    try {
      const { data } = await getAllDeployedModel(projectId);
      const onlineDeploys = (data || []).filter((d) => d.status === "ONLINE");
      const sorted = onlineDeploys.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      setDeploys(sorted);
      if (sorted.length > 0 && !selectedDeployId) {
        setSelectedDeployId(String(sorted[0].id));
      }
    } catch (e) {
      toast.error("Failed to fetch deploy list");
    }
  }, [projectId, selectedDeployId]);

  useEffect(() => { fetchDeploys(); }, [fetchDeploys]);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const { data } = await getProjectById(projectId);
        setProjectInfo(data.project);
      } catch (e) {
        console.error("Failed to fetch project info", e);
      }
    };
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!selectedDeployId) {
        setModelMetadata(null);
        setSelectedDeploy(null);
        return;
      }
      const deploy = deploys.find((d) => d.id === Number(selectedDeployId));
      if (!deploy) return;
      try {
        setSelectedDeploy(deploy);
        const modelRes = await getLatestModelVersionByModelId(deploy.model_id);
        setModelMetadata(modelRes.data);
        const deployRes = await getDeployData(deploy.id);
        setSelectedDeploy(deployRes.data);
      } catch (e) {
        console.error("Failed to fetch model metadata", e);
      }
    };
    fetchMetadata();
  }, [selectedDeployId, deploys]);

  const resolveTaskType = () => {
    const raw = projectInfo?.task_type;
    if (!raw) return "image_classification";
    const upper = String(raw).toUpperCase();
    if (upper.includes("OBJECT") || upper.includes("DETECT")) return "object_detection";
    if (upper.includes("TEXT")) return "text_classification";
    return "image_classification";
  };

  const buildMetadata = () => ({
    projectName: projectInfo?.name,
    projectDescription: projectInfo?.description,
    taskType: projectInfo?.task_type,
    description: projectInfo?.description || `A model for ${projectInfo?.task_type}`,
    labelsName: modelMetadata?.metadata?.label_column,
    labelValues: modelMetadata?.metadata?.labels,
    apiUrl: selectedDeploy?.api_base_url,
    sampleData: modelMetadata?.metadata?.sample_data,
    modelInfo: modelMetadata,
  });

  const handleConfirmGenApp = async () => {
    if (!selectedModelId) {
      toast.error("Please select a model");
      return;
    }
    setGenLoading(true);
    try {
      await genApp({
        modelId: selectedModelId,
        projectId,
        name: appName?.trim() || null,
        taskType: resolveTaskType(),
        metadata: buildMetadata(),
      });
      toast.success("App generated successfully");
      refetch();
      setIsFormOpen(false);
      setAppName("");
    } catch (e) {
      toast.error("Failed to generate app");
    } finally {
      setGenLoading(false);
    }
  };

  const handleRetry = async (app) => {
    if (!app?.model_id) { toast.error("Cannot retry: missing model info"); return; }
    const deploy = deploys.find((d) => d.model_id === app.model_id);
    if (!deploy) { toast.error("Cannot retry: missing deploy info"); return; }
    setGenLoading(true);
    try {
      const [modelRes, deployRes] = await Promise.all([
        getLatestModelVersionByModelId(app.model_id),
        getDeployData(deploy.id),
      ]);
      const metadata = {
        projectName: projectInfo?.name,
        projectDescription: projectInfo?.description,
        taskType: app.task_type || projectInfo?.task_type,
        description: projectInfo?.description || `A model for ${app.task_type}`,
        labelsName: modelRes.data?.metadata?.label_column,
        labelValues: modelRes.data?.metadata?.labels,
        apiUrl: deployRes.data?.api_base_url,
        sampleData: modelRes.data?.metadata?.sample_data,
        modelInfo: modelRes.data,
      };
      await genApp({
        modelId: app.model_id,
        projectId,
        name: app.name || `App #${app.id}`,
        taskType: app.task_type || resolveTaskType(),
        metadata,
      });
      toast.success("App retry successful");
      refetch();
    } catch (e) {
      toast.error("App retry failed");
    } finally {
      setGenLoading(false);
    }
  };

  const taskTypeLabel =
    resolveTaskType() === "object_detection"
      ? "Object Detection"
      : resolveTaskType() === "text_classification"
        ? "Text Classification"
        : "Image Classification";

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-slate-950">
      <div className="w-full px-6 py-8 flex flex-col gap-6">

        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Apps
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {loading ? "Loading…" : `${total} app${total !== 1 ? "s" : ""} generated`}
            </p>
          </div>
        </div>

        {/* Gen App toolbar — only when deploys exist */}
        {deploys.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                  <span className="w-1 h-5 rounded-full bg-blue-500 shrink-0" />
                  Generate App
                </h2>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Select a deployed model and generate an app from it.
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center gap-3 sm:flex-nowrap">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Model
                </label>
                <Select
                  value={selectedDeployId ?? ""}
                  onValueChange={(val) => setSelectedDeployId(val)}
                >
                  <SelectTrigger className="h-10 min-w-[220px] rounded-xl border-gray-200 bg-white text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white">
                    <SelectValue placeholder="Select a model…" />
                  </SelectTrigger>
                  <SelectContent align="start" position="popper" className="rounded-xl border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-950">
                    {deploys.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name ?? `Model #${d.model_id}`} (Deploy {d.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => { setAppName(""); setIsFormOpen(true); }}
                  disabled={!selectedModelId}
                  className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  <Rocket className="size-4" />
                  Gen App
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400">
            Error loading app list: {error?.message ?? "Unknown"}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex min-h-52 items-center justify-center">
            <Spinner className="size-6 text-blue-500" />
          </div>
        ) : apps.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {apps.map((app, i) => (
                <AppCard
                  key={app.id ?? i}
                  app={app}
                  onViewDetails={async (app) => {
                    try { await initDraft(app.id); } catch (e) { console.warn("[GenApp] initDraft before nav:", e); }
                    navigate(`/app/project/${projectId}/my-apps/${app.id}/edit`);
                  }}
                  onRetry={handleRetry}
                  isRetrying={genLoading}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(1)}
                  disabled={page === 1 || loading}
                  aria-label="First page"
                  className="size-9 rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                >
                  «
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  aria-label="Previous page"
                  className="size-9 rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                >
                  ‹
                </Button>
                <span className="flex h-9 min-w-[72px] items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  aria-label="Next page"
                  className="size-9 rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                >
                  ›
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages || loading}
                  aria-label="Last page"
                  className="size-9 rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                >
                  »
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty state */
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white/70 text-center dark:border-white/10 dark:bg-white/5">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
              <Network className="size-6 text-blue-500 dark:text-blue-400" />
            </div>
            {deploys.length === 0 ? (
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  No deployed model found
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Deploy a model first before generating an app.
                </p>
                <Button
                  onClick={() => navigate(PATHS.PROJECT_DEPLOY(projectId))}
                  className="mt-4 h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                >
                  Go to Deploy
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  No apps yet
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select a model and click Gen App to create your first app.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gen App Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="rounded-2xl border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
              Gen App Configuration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Model
              </label>
              <Select
                value={selectedDeployId ?? ""}
                onValueChange={(val) => setSelectedDeployId(val)}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white">
                  <SelectValue placeholder="Select a model…" />
                </SelectTrigger>
                <SelectContent align="start" position="popper" className="rounded-xl border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-950">
                  {deploys.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name ?? `Model #${d.model_id}`} (Deploy {d.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                App name
              </label>
              <Input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Enter the app name"
                className="h-10 w-full rounded-xl border-gray-200 bg-white text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task type
              </label>
              <Input
                type="text"
                value={taskTypeLabel}
                readOnly
                className="h-10 w-full rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed dark:border-white/20 dark:bg-white/5 dark:text-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Automatically determined from the project.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setIsFormOpen(false); setAppName(""); }}
              className="h-10 rounded-xl border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-700/50 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmGenApp}
              disabled={genLoading}
              className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {genLoading ? <><Spinner className="size-4" /> Processing…</> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
