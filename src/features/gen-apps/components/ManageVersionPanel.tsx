import { useState, useEffect, useCallback } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import { workspaceApi } from "src/features/gen-apps/api/workspace";
import { Spinner } from "src/components/ui/spinner";

const VersionRow = ({ version, isCurrent, onDeploy }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChangelog = Boolean(version?.changelog?.trim());

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-colors ${
        isCurrent
          ? "border-blue-200 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-900/20"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10"
      }`}
    >
      <div
        className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 ${
          hasChangelog ? "" : "cursor-default"
        }`}
        onClick={() => hasChangelog && setExpanded((e) => !e)}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`text-sm font-semibold ${
              isCurrent
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            Version {version.version_number}
          </span>
          {isCurrent && (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-300">
              Deployed
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isCurrent && onDeploy && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeploy(version.version_number);
              }}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-blue-500/30 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
            >
              Deploy
            </button>
          )}
          {hasChangelog && (
            <ChevronDown
              className={`size-4 shrink-0 text-gray-400 transition-transform dark:text-gray-500 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>
      {expanded && hasChangelog && (
        <div className="border-t border-gray-100 px-4 pb-3 pt-2 dark:border-white/10">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Changelog
          </p>
          <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
            {version.changelog}
          </p>
        </div>
      )}
    </div>
  );
};

const ManageVersionPanel = ({ appId, onDeployVersion }) => {
  const [data, setData] = useState({ versions: [], current_version: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVersions = useCallback(async () => {
    if (!appId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await workspaceApi.getVersionsSummary(appId);
      setData({
        versions: res.versions ?? [],
        current_version: res.current_version ?? null,
      });
    } catch (err) {
      setError(err?.message || "Failed to load versions");
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Spinner className="size-4" />
        Loading versions…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>
    );
  }

  const { versions, current_version } = data;

  if (!versions?.length) {
    return (
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
        No versions yet. Deploy to create your first version.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 px-4 py-2 dark:border-white/10">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {versions.length} version{versions.length !== 1 ? "s" : ""}
        </span>
        <button
          type="button"
          onClick={fetchVersions}
          className="flex items-center gap-1 text-xs font-medium text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <RefreshCw className="size-3" />
          Refresh
        </button>
      </div>

      {/* Version list */}
      <div className="min-h-0 flex-1 space-y-2 overflow-auto p-3">
        {versions.map((v) => (
          <VersionRow
            key={v.id ?? v.version_number}
            version={v}
            isCurrent={String(v.version_number) === String(current_version)}
            onDeploy={onDeployVersion}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageVersionPanel;
