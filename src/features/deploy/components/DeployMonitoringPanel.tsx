import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { ChartLine, Copy, Gauge, Monitor } from "lucide-react";

function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function DeployMonitoringPanel({
  deployData,
  projectInfo,
  taskConfig,
  onUploadFiles,
}) {
  if (!deployData || !projectInfo) return null;

  const monitorUrl = deployData?.monitor_url || "https://api.example.com";
  const openMonitoring = (path: string) => {
    if (!deployData?.monitor_url) return;
    window.open(`${deployData.monitor_url}${path}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4 dark:border-white/10">
          <span className="w-1 h-5 rounded-full bg-blue-500 shrink-0" />
          <Monitor className="size-4 text-blue-500 dark:text-blue-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Monitoring
          </h2>
        </div>
        <div className="px-5 py-5">
          <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Monitor Endpoint URL
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Input
              className="h-10 flex-1 rounded-xl border-gray-200 bg-white px-3 text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
              value={monitorUrl}
              readOnly
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => copyToClipboard(monitorUrl)}
                className="h-10 rounded-xl border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                <Copy className="size-4" />
                Copy URL
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!deployData?.monitor_url}
                onClick={() => openMonitoring("/d/rYdddlPWk/node-exporter-full")}
                className="h-10 rounded-xl border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                <ChartLine className="size-4" />
                System Monitoring
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!deployData?.monitor_url}
                onClick={() => openMonitoring("/d/vlvPlrgnk/gpu-metrics")}
                className="h-10 rounded-xl border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                <Gauge className="size-4" />
                GPU Monitoring
              </Button>
            </div>
          </div>
        </div>
      </div>

      {taskConfig?.liveInferView &&
        (() => {
          const LiveInferComponent = taskConfig.liveInferView;
          return (
            <LiveInferComponent
              projectInfo={projectInfo}
              handleUploadFiles={onUploadFiles}
            />
          );
        })()}
    </>
  );
}
