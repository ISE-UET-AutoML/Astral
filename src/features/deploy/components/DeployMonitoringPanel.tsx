import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
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
      <Card className="rounded-2xl border border-gray-200 bg-white/95 shadow-lg dark:border-white/10 dark:bg-white/5">
        <CardHeader className="border-b border-gray-200 px-5 py-4 dark:border-white/10">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <Monitor className="size-5 text-blue-600 dark:text-blue-300" />
            Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Monitor Endpoint URL
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Input
              className="h-10 flex-1 rounded-xl border-gray-200 bg-white px-3 text-sm text-gray-900 dark:border-white/10 dark:bg-white/10 dark:text-white"
              value={monitorUrl}
              readOnly
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => copyToClipboard(monitorUrl)}
              >
                <Copy className="size-4" />
                Copy URL
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={!deployData?.monitor_url}
                onClick={() => openMonitoring("/d/rYdddlPWk/node-exporter-full")}
              >
                <ChartLine className="size-4" />
                System Monitoring
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={!deployData?.monitor_url}
                onClick={() => openMonitoring("/d/vlvPlrgnk/gpu-metrics")}
              >
                <Gauge className="size-4" />
                GPU Monitoring
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
