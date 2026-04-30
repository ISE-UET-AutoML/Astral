import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Spinner } from "src/components/ui/spinner";
import { CloudUpload, Copy, ExternalLink, Link, Sparkles } from "lucide-react";
import UpDataDeploy from "src/features/deploy/components/UpDataDeploy";

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

export function DeployEndpointPanel({
  deployData,
  projectInfo,
  model,
  uploading,
  isShowUpload,
  isGeneratingUI,
  isCheckingUIStatus,
  isUIGenerated,
  onOpenUpload,
  onCloseUpload,
  onUploadComplete,
  onGenerateUI,
}) {
  if (!deployData || !projectInfo) return null;

  const apiUrl =
    deployData?.api_base_url || "https://api.example.com/predict/model-123";
  const uiActionDisabled = isGeneratingUI || isCheckingUIStatus;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 dark:border-white/10 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Link className="size-4" />
            </span>
            Endpoint Information
          </div>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Copy the live prediction endpoint, upload files for inference, or
            open the generated UI when it is ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => copyToClipboard(apiUrl)}
            className="h-10 rounded-xl border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            <Copy className="size-4" />
            Copy URL
          </Button>
          <Button
            type="button"
            onClick={onOpenUpload}
            disabled={uploading}
            className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            {uploading ? <Spinner className="size-4" /> : <CloudUpload className="size-4" />}
            {uploading ? "Predicting..." : "Upload Files"}
          </Button>
          <Button
            type="button"
            onClick={uiActionDisabled ? undefined : onGenerateUI}
            disabled={uiActionDisabled}
            className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            {isGeneratingUI ? (
              <Spinner className="size-4" />
            ) : isUIGenerated ? (
              <ExternalLink className="size-4" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {isCheckingUIStatus
              ? "Checking"
              : isGeneratingUI
                ? "Generating"
                : isUIGenerated
                  ? "Open App"
                  : "Generate UI"}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 px-6 py-5">
        <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              API Endpoint URL
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use this endpoint for direct prediction requests from external
              clients and generated apps.
            </p>
          </div>
          <Input
            className="h-10 rounded-xl border-gray-200 bg-white px-3 text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
            value={apiUrl}
            readOnly
          />
        </div>
        <UpDataDeploy
          isOpen={isShowUpload}
          onClose={onCloseUpload}
          projectId={model?.id}
          taskType={projectInfo?.task_type}
          featureColumns={Object.keys(model?.metadata?.csv || {})}
          onUploadStart={null}
          onUploadComplete={onUploadComplete}
        />
      </div>
    </div>
  );
}
