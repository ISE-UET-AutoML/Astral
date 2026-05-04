import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { workspaceApi, initDraft } from "src/features/gen-apps/api/workspace";
import { Button } from "src/components/ui/button";
import { Textarea } from "src/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import {
  ChatPanel,
  TreePanel,
  CodeEditorPanel,
} from "src/features/gen-apps/components";
import { USE_GEN_APP_MOCKS } from "src/features/gen-apps/mocks";
import {
  useFileTree,
  useFileEditor,
  useSaveShortcut,
  useAmtaModify,
} from "src/shared/hooks";
import {
  ArrowLeftIcon,
  Upload,
  RefreshCw,
  SquareCode,
  Monitor,
  TriangleAlert,
  X,
} from "lucide-react";

const AUTOSAVE_DEBOUNCE_MS = 1500;

const EditAppPage = () => {
  const { appId, id: projectId } = useParams();
  const navigate = useNavigate();
  const [currentFile, setCurrentFile] = useState("");
  const [originalCode, setOriginalCode] = useState("");
  const [isAdapting, setIsAdapting] = useState(false);
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [activeMainView, setActiveMainView] = useState("app");
  const [errors, setErrors] = useState([]);
  const [app, setApp] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [currentVersionNumber, setCurrentVersionNumber] = useState(null);
  const [deployDialog, setDeployDialog] = useState({
    open: false,
    versionNumber: undefined,
    description: "",
  });

  const autoSaveTimerRef = useRef(null);
  const addError = useCallback((message, type = "error") => {
    setErrors((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), message, type },
    ]);
  }, []);
  const dismissError = useCallback((id) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);
  const clearAllErrors = useCallback(() => setErrors([]), []);

  const hasAutoLoadedRef = useRef(false);

  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  const { tree, refetch: refetchTree } = useFileTree(appId);
  const { code, setCode, isSaving } = useFileEditor(
    appId,
    currentFile,
    originalCode,
  );

  const loadFile = useCallback(
    async (path) => {
      try {
        const data = await workspaceApi.getFile(appId, path);
        setCode(data.content);
        setOriginalCode(data.content);
        setCurrentFile(path);
      } catch (error) {
        console.error("Failed to load file:", error);
        toast.error("Failed to load file");
        addError("Failed to load file");
      }
    },
    [appId, setCode, addError],
  );

  const currentFileRef = useRef(currentFile);
  useEffect(() => {
    currentFileRef.current = currentFile;
  }, [currentFile]);

  const handleModificationSuccess = useCallback(() => {
    refetchTree();
    setTimeout(() => {
      if (currentFileRef.current) {
        loadFile(currentFileRef.current);
      }
    }, 800);
  }, [refetchTree, loadFile]);

  const { chatInput, setChatInput, isStreaming, liveMessages, sendMessage } =
    useAmtaModify({
      appId,
      instanceId: app?.instance_id,
      modelId: app?.model_id,
      taskType: app?.task_type,
      metadata: app?.metadata,
      projectId: app?.project_id,
      name: app?.name,
      onSuccess: handleModificationSuccess,
    });

  const refreshCurrentVersion = useCallback(async () => {
    if (!appId) return;
    try {
      const res = await workspaceApi.getVersionsSummary(appId);
      setCurrentVersionNumber(res?.current_version ?? null);
    } catch {
      setCurrentVersionNumber(null);
    }
  }, [appId]);

  useEffect(() => {
    if (!appId) return;
    workspaceApi
      .getApp(appId)
      .then(setApp)
      .catch((err) => {
        console.error("[EditAppPage] Failed to fetch app info:", err);
      });

    workspaceApi
      .initDraft(appId)
      .then((result) => {
        console.log("[EditAppPage] Draft initialized successfully:", result);
      })
      .catch((err) => {
        console.error("[EditAppPage] Failed to init draft:", err);
        toast.error("Failed to initialize draft. Check console for details.");
        addError("Failed to initialize draft. Check console for details.");
      });
  }, [appId, addError]);

  useEffect(() => {
    refreshCurrentVersion();
  }, [refreshCurrentVersion]);

  const findIndexHtml = useCallback((node, currentPath = "") => {
    if (!node.children) return null;
    for (const [name, child] of Object.entries(node.children)) {
      if (name === "index.html" && child.type === "file") {
        return currentPath ? `${currentPath}/index.html` : "index.html";
      }
    }
    const sortedEntries = Object.entries(node.children)
      .filter(([_, child]) => child.type === "dir")
      .sort(([nameA], [nameB]) => {
        if (nameA === "frontend") return -1;
        if (nameB === "frontend") return 1;
        return nameA.localeCompare(nameB);
      });
    for (const [name, child] of sortedEntries) {
      const path = currentPath ? `${currentPath}/${name}` : name;
      const found = findIndexHtml(child, path);
      if (found) return found;
    }
    return null;
  }, []);

  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      if (!currentFile || !appId) return;
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        workspaceApi.saveFile(appId, currentFile, newCode).catch(() => {});
      }, AUTOSAVE_DEBOUNCE_MS);
    },
    [appId, currentFile, setCode],
  );

  const handleSaveFile = useCallback(async () => {
    if (!currentFile) {
      toast.warning("No file opened!");
      return;
    }
    clearTimeout(autoSaveTimerRef.current);
    try {
      await workspaceApi.saveFile(appId, currentFile, code);
      await workspaceApi.saveDraftSnapshot(appId);
      setOriginalCode(code);
      toast.success("Saved!");
    } catch (error) {
      console.error("Failed to save file:", error);
      toast.error("Failed to save file!");
      addError("Failed to save file!");
    }
  }, [appId, currentFile, code, addError]);

  const handleSaveSnapshot = useCallback(async () => {
    if (!appId) {
      toast.error("Invalid app ID, cannot save snapshot");
      return;
    }
    const description = window.prompt("Snapshot description (optional):");
    if (description === null) return;
    setIsSnapshotting(true);
    const hide = toast.loading("Saving draft snapshot to S3...", 0);
    try {
      const result = await workspaceApi.saveDraftSnapshot(
        appId,
        description || undefined,
      );
      console.log("[EditAppPage] Snapshot saved:", result);
      toast.success("Draft snapshot saved to S3");
    } catch (err) {
      console.error("[EditAppPage] Failed to save snapshot:", err);
      toast.error("Failed to save draft snapshot");
      addError("Failed to save draft snapshot");
    } finally {
      hide();
      setIsSnapshotting(false);
    }
  }, [appId, addError]);

  const runDeploy = useCallback(
    async ({ versionNumber, description = "" }) => {
      if (!appId) {
        toast.error("Invalid app ID, cannot deploy");
        return;
      }
      const isRedeploy = versionNumber !== undefined;
      setIsDeploying(true);
      const hide = toast.loading(
        isRedeploy
          ? `Redeploying version v${versionNumber}...`
          : "Deploying draft as new version...",
        0,
      );
      try {
        const result = isRedeploy
          ? await workspaceApi.deployVersion(appId, versionNumber)
          : await workspaceApi.deployDraft(appId, description || undefined);
        console.log("[EditAppPage] Deployment successful:", result);
        toast.success(
          result?.version_number
            ? `Deployed as version v${result.version_number}`
            : "Deployed successfully",
        );
        refreshCurrentVersion();
        if (isRedeploy) {
          refetchTree();
          setTimeout(() => {
            if (currentFile) loadFile(currentFile);
          }, 500);
        }
      } catch (err) {
        console.error("[EditAppPage] Failed to deploy:", err);
        toast.error("Failed to deploy");
        addError("Failed to deploy");
      } finally {
        hide();
        setIsDeploying(false);
      }
    },
    [
      appId,
      addError,
      currentFile,
      refetchTree,
      loadFile,
      refreshCurrentVersion,
    ],
  );

  const handleDeploy = useCallback((versionNumber) => {
    setDeployDialog({
      open: true,
      versionNumber,
      description: "",
    });
  }, []);

  const handleConfirmDeploy = useCallback(() => {
    const { versionNumber, description } = deployDialog;
    setDeployDialog((prev) => ({ ...prev, open: false }));
    runDeploy({ versionNumber, description });
  }, [deployDialog, runDeploy]);

  useSaveShortcut(currentFile, code, handleSaveFile);

  const mockPreviewHtml =
    USE_GEN_APP_MOCKS && currentFile.endsWith("index.html") ? code : "";
  const previewUrl =
    app?.host && app?.ports?.frontend
      ? `http://${app.host}:${app.ports.frontend}`
      : "";

  useEffect(() => {
    if (!appId) return;
    initDraft(appId).catch((err) => {
      console.warn("[EditAppPage] initDraft failed:", err);
    });
  }, [appId]);

  useEffect(() => {
    if (!tree || currentFile || hasAutoLoadedRef.current) return;
    const indexHtmlPath = findIndexHtml(tree);
    if (indexHtmlPath) {
      hasAutoLoadedRef.current = true;
      loadFile(indexHtmlPath);
    }
  }, [tree, currentFile, findIndexHtml, loadFile]);

  if (!appId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Invalid app ID
          </p>
          <Button onClick={() => navigate(`/app/project/${projectId}/my-apps`)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gray-100 dark:bg-slate-950">
      <div className="grid min-h-0 flex-1 grid-cols-[360px_1fr] overflow-hidden">
        {/* Left: Chat panel */}
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <ChatPanel
            appId={appId}
            input={chatInput}
            onInputChange={setChatInput}
            onSendMessage={sendMessage}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            liveMessages={liveMessages}
            onDeployVersion={handleDeploy}
          />
        </div>

        {/* Right: Workspace */}
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-gray-50 dark:bg-slate-900">
          {/* Toolbar */}
          <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 dark:border-white/10 dark:bg-slate-900">
            {/* App / Code segmented control */}
            <div className="flex items-center gap-3">
              <div className="relative grid h-9 w-[168px] grid-cols-2 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMainView("app");
                    setPreviewKey((k) => k + 1);
                  }}
                  className={`relative z-10 flex h-full items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeMainView === "app"
                      ? "text-blue-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Monitor className="size-4 shrink-0" />
                  App
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMainView("code")}
                  className={`relative z-10 flex h-full items-center justify-center gap-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeMainView === "code"
                      ? "text-blue-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <SquareCode className="size-4 shrink-0" />
                  Code
                </button>
                {/* Sliding pill */}
                <div
                  aria-hidden
                  className={`absolute bottom-0.5 top-0.5 rounded-full bg-white ring-1 ring-gray-200/60 transition-all duration-200 ease-out dark:bg-white/15 dark:ring-white/10 ${
                    activeMainView === "app"
                      ? "left-0.5 right-[calc(50%+0.5px)]"
                      : "left-[calc(50%+0.5px)] right-0.5"
                  }`}
                />
              </div>

              {currentVersionNumber !== null && (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-300">
                  v{currentVersionNumber} deployed
                </span>
              )}
            </div>

            {/* Deploy button */}
            <button
              type="button"
              onClick={() => handleDeploy()}
              disabled={isDeploying}
              className="flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {isDeploying ? (
                <RefreshCw className="size-4 shrink-0 animate-spin" />
              ) : (
                <Upload className="size-4 shrink-0" />
              )}
              {isDeploying ? "Deploying…" : "Deploy"}
            </button>
          </div>

          {/* Code view: Tree + Editor */}
          {activeMainView === "code" && (
            <div className="flex min-h-0 flex-1 overflow-hidden">
              <div className="flex min-h-0 w-60 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-slate-900">
                <TreePanel tree={tree} onOpen={loadFile} />
              </div>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <CodeEditorPanel
                  currentFile={currentFile}
                  code={code}
                  originalCode={originalCode}
                  isSaving={isSaving}
                  onCodeChange={handleCodeChange}
                  onSave={handleSaveFile}
                />
              </div>
            </div>
          )}

          {/* App preview */}
          {activeMainView === "app" && (
            <div className="flex min-h-0 flex-1 flex-col">
              {/* URL bar */}
              <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-white/10 dark:bg-slate-900">
                {(mockPreviewHtml || previewUrl) && (
                  <div className="flex w-full items-center rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20">
                    <button
                      type="button"
                      onClick={() => setPreviewKey((k) => k + 1)}
                      className="ml-1 shrink-0 rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                      title="Reload preview"
                    >
                      <RefreshCw className="size-4" />
                    </button>
                    <a
                      href={previewUrl || undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-w-0 flex-1 items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <span className="truncate">
                        {mockPreviewHtml ? "frontend/index.html" : previewUrl}
                      </span>
                    </a>
                  </div>
                )}
              </div>

              {/* iframe / placeholder */}
              <div className="relative min-h-0 flex-1">
                {mockPreviewHtml ? (
                  <iframe
                    key={previewKey}
                    title="App Preview"
                    srcDoc={mockPreviewHtml}
                    className="absolute inset-0 h-full w-full border-0 bg-white dark:bg-slate-950"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    referrerPolicy="no-referrer"
                  />
                ) : previewUrl ? (
                  <iframe
                    key={previewKey}
                    title="App Preview"
                    src={previewUrl}
                    className="absolute inset-0 h-full w-full border-0 bg-white dark:bg-slate-950"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    {app ? (
                      <>
                        <TriangleAlert className="mb-3 size-10 text-amber-500" />
                        <p className="font-medium text-gray-700 dark:text-gray-300">
                          Instance not yet available
                        </p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Please wait while the instance starts up.
                        </p>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mb-3 size-8 animate-spin text-blue-500" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Fetching instance info…
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error bar */}
      {errors.length > 0 && (
        <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-t border-red-200 bg-red-50 px-3 py-2 dark:border-red-500/20 dark:bg-red-900/20">
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400">
            <TriangleAlert className="size-4" />
            {errors.length} error{errors.length !== 1 ? "s" : ""}
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
            {errors.map((e) => (
              <div
                key={e.id}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-900/30 dark:text-red-300"
              >
                <span className="max-w-[280px] truncate" title={e.message}>
                  {e.message}
                </span>
                <button
                  type="button"
                  onClick={() => dismissError(e.id)}
                  className="rounded p-0.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/40"
                  title="Dismiss"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={clearAllErrors}
            className="shrink-0 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
          >
            Clear all
          </button>
        </div>
      )}

      <Dialog
        open={deployDialog.open}
        onOpenChange={(open) =>
          setDeployDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="rounded-2xl border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
              {deployDialog.versionNumber !== undefined
                ? `Redeploy version v${deployDialog.versionNumber}`
                : "Deploy draft"}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-gray-500 dark:text-gray-400">
              {deployDialog.versionNumber !== undefined
                ? "This will redeploy the selected version to Vast.ai."
                : "This will create a new version from the current draft and deploy it to Vast.ai."}
            </DialogDescription>
          </DialogHeader>

          {deployDialog.versionNumber === undefined && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Version description
              </label>
              <Textarea
                value={deployDialog.description}
                onChange={(event) =>
                  setDeployDialog((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Optional changelog or release note"
                className="min-h-24 resize-none rounded-xl border-gray-200 bg-white text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
              />
            </div>
          )}

          <DialogFooter className="-mx-4 -mb-4 rounded-b-2xl border-t border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDeployDialog((prev) => ({ ...prev, open: false }))
              }
              disabled={isDeploying}
              className="h-10 rounded-xl border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-white/20 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDeploy}
              disabled={isDeploying}
              className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  Deploying...
                </>
              ) : deployDialog.versionNumber !== undefined ? (
                "Redeploy"
              ) : (
                "Deploy"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditAppPage;
