import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
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
    <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
      <CardHeader className="border-b border-slate-200/80 px-6 py-5 dark:border-white/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-950 dark:text-white">
              <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/20">
                <Link className="size-5" />
              </span>
              Endpoint Information
            </CardTitle>
            <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Copy the live prediction endpoint, upload files for inference, or
              open the generated UI when it is ready.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => copyToClipboard(apiUrl)}
              className="h-10 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:hover:bg-white/10"
            >
              <Copy className="size-4" />
              Copy URL
            </Button>
            <Button
              type="button"
              onClick={onOpenUpload}
              disabled={uploading}
              className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {uploading ? (
                <Spinner className="size-4" />
              ) : (
                <CloudUpload className="size-4" />
              )}
              {uploading ? "Predicting..." : "Upload Files"}
            </Button>
            <Button
              type="button"
              onClick={uiActionDisabled ? undefined : onGenerateUI}
              disabled={uiActionDisabled}
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
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
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                API Endpoint URL
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Use this endpoint for direct prediction requests from external
                clients and generated apps.
              </p>
            </div>
          </div>
          <Input
            className="h-11 rounded-xl border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-950/70 dark:text-white"
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
      </CardContent>
    </Card>
  );
}
