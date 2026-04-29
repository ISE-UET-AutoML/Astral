import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "src/components/ui/dialog";
import { Spinner } from "src/components/ui/spinner";
import {
  Settings as SettingOutlined,
  Download as DownloadOutlined,
} from "lucide-react";
import ImageHistoryViewer from "src/features/models/components/ImageHistoryViewer";
import TextHistoryViewer from "src/features/models/components/TextHistoryViewer";
import MultilabelHistoryViewer from "src/features/models/components/MultilabelHistoryViewer";

export function DeployPredictionViewerModal({
  projectInfo,
  isVisible,
  isLoading,
  selectedContent,
  onClose,
  onDownloadCsv,
  simpleDataModalRef,
  multilabelModalRef,
}) {
  if (!projectInfo?.id) return null;

  const isImageTask = projectInfo.task_type?.includes("IMAGE");
  const isMultilabelTask = projectInfo.task_type?.includes("MULTILABEL");

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prediction Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-96 items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <>
            {isImageTask && <ImageHistoryViewer data={selectedContent} />}
            {!isImageTask && isMultilabelTask && (
              <MultilabelHistoryViewer
                data={selectedContent}
                ref={multilabelModalRef}
              />
            )}
            {!isImageTask && !isMultilabelTask && (
              <TextHistoryViewer
                data={selectedContent}
                ref={simpleDataModalRef}
              />
            )}
          </>
        )}

        <DialogFooter className="flex gap-2 justify-end mt-6">
          {!isImageTask && (
            <button
              onClick={() => simpleDataModalRef.current?.openDrawer()}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
            >
              <SettingOutlined className="h-4 w-4" />
              Columns
            </button>
          )}
          {!isImageTask && (
            <button
              onClick={onDownloadCsv}
              disabled={!selectedContent}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/20 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15"
            >
              <DownloadOutlined className="h-4 w-4" />
              CSV
            </button>
          )}
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
