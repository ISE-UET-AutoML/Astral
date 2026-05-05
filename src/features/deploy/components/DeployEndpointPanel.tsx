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

  const rawUrl = deployData?.api_base_url;
  const apiUrl =
    (typeof rawUrl === "string" && rawUrl.trim()) ||
    "https://api.example.com/predict/model-123";
  const uiActionDisabled = isGeneratingUI || isCheckingUIStatus;

  const outlineBtnClass =
    "h-10 rounded-xl border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";

  const urlInputClassName =
    "h-10 min-w-0 flex-1 rounded-xl border-gray-200 bg-white px-3 text-sm text-gray-900 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-gray-200 px-5 py-4 dark:border-white/10">
        <span className="h-5 w-1 shrink-0 rounded-full bg-blue-500" />
        <Link className="size-4 shrink-0 text-blue-500 dark:text-blue-400" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Endpoint Information
        </h2>
      </div>

      <div className="px-5 py-5">
        <div className="mb-2 space-y-1">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            API endpoint URL
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Copy the live prediction endpoint, upload files for inference, or open
            the generated UI when it is ready.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label htmlFor="deploy-api-endpoint-url" className="sr-only">
            API endpoint URL
          </label>
          <Input
            id="deploy-api-endpoint-url"
            className={urlInputClassName}
            value={apiUrl}
            readOnly
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => copyToClipboard(apiUrl)}
              className={outlineBtnClass}
            >
              <Copy className="size-4" />
              Copy URL
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onOpenUpload}
              disabled={uploading}
              className={outlineBtnClass}
            >
              {uploading ? <Spinner className="size-4" /> : <CloudUpload className="size-4" />}
              {uploading ? "Predicting..." : "Upload Files"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={uiActionDisabled ? undefined : onGenerateUI}
              disabled={uiActionDisabled}
              className={outlineBtnClass}
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
  );
}
