import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import { Spinner } from "src/components/ui/spinner";
import {
  CloudUpload,
  Copy,
  ExternalLink,
  Link,
  Sparkles,
} from "lucide-react";
import UpDataDeploy from "src/components/shared/utilities/UpDataDeploy";

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
    <Card className="rounded-2xl border border-gray-200 bg-white/95 shadow-lg dark:border-white/10 dark:bg-white/5">
      <CardHeader className="border-b border-gray-200 px-5 py-4 dark:border-white/10">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Link className="size-5 text-blue-600 dark:text-blue-300" />
          Endpoint Information
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-5">
        <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
          API Endpoint URL
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <Input
            className="h-10 flex-1 rounded-xl border-gray-200 bg-white px-3 text-sm text-gray-900 dark:border-white/10 dark:bg-white/10 dark:text-white"
            value={apiUrl}
            readOnly
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => copyToClipboard(apiUrl)}
            >
              <Copy className="size-4" />
              Copy URL
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={onOpenUpload}
              disabled={uploading}
              className="bg-blue-600 text-white hover:bg-blue-700"
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
              size="lg"
              onClick={uiActionDisabled ? undefined : onGenerateUI}
              disabled={uiActionDisabled}
              className="bg-blue-600 text-white hover:bg-blue-700"
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
