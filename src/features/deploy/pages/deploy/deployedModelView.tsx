import { useParams } from "react-router-dom";
import { Rocket as RocketLaunchIcon } from "lucide-react";
import { useDeployView } from "src/features/deploy/hooks/useDeployView";
import {
  DeploySummaryStats,
  DeployEndpointPanel,
  DeployMonitoringPanel,
  DeployHistorySection,
  DeployPredictionViewerModal,
  DeployCloudServerCard,
} from "src/features/deploy/components";

export default function DeployedModelView() {
  const { deployId, id: projectId } = useParams();

  const {
    recentPredictions,
    projectInfo,
    deployData,
    model,
    predictResult,
    uploadedFiles,
    uploading,
    isShowUpload,
    isLoadingPredictions,
    isModalVisible,
    isJsonLoading,
    selectedPredictionContent,
    simpleDataModalRef,
    multilabelModalRef,
    isGeneratingUI,
    isCheckingUIStatus,
    isUIGenerated,
    s3Url,
    taskConfig,
    handleOpenUpload,
    handleCloseUpload,
    handleUploadFiles,
    handleCloseModal,
    handleDownloadHistory,
    handleViewPrediction,
    handleGenerateUI,
  } = useDeployView({ deployId, projectId });

  return (
    <div className="min-h-screen bg-gray-100 px-6 pb-20 pt-6 dark:bg-[#161616]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
              <RocketLaunchIcon className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Deployment View
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Monitor and manage your deployed model
              </p>
            </div>
          </div>
        </div>

        <DeploySummaryStats
          deployData={deployData}
          recentPredictions={recentPredictions}
        />

        {deployData?.status === "ONLINE" && projectInfo && (
          <DeployEndpointPanel
            deployData={deployData}
            projectInfo={projectInfo}
            model={model}
            uploading={uploading}
            isShowUpload={isShowUpload}
            isGeneratingUI={isGeneratingUI}
            isCheckingUIStatus={isCheckingUIStatus}
            isUIGenerated={isUIGenerated}
            onOpenUpload={handleOpenUpload}
            onCloseUpload={handleCloseUpload}
            onUploadComplete={handleUploadFiles}
            onGenerateUI={handleGenerateUI}
          />
        )}

        {deployData?.status === "ONLINE" && projectInfo && (
          <DeployMonitoringPanel
            deployData={deployData}
            projectInfo={projectInfo}
            taskConfig={taskConfig}
            onUploadFiles={handleUploadFiles}
          />
        )}

        {deployData?.status === "ONLINE" &&
          !uploading &&
          predictResult &&
          projectInfo && (
            <>
              {(() => {
                if (taskConfig) {
                  const PredictComponent = taskConfig.predictView;
                  return (
                    <PredictComponent
                      predictResult={predictResult}
                      uploadedFiles={uploadedFiles}
                      projectInfo={projectInfo}
                      handleUploadFiles={handleUploadFiles}
                      model={model}
                      s3_url={s3Url || deployData?.s3_url}
                    />
                  );
                }
                return null;
              })()}
            </>
          )}

        <DeployHistorySection
          recentPredictions={recentPredictions}
          isLoadingPredictions={isLoadingPredictions}
          onViewPrediction={handleViewPrediction}
        />

        <DeployPredictionViewerModal
          projectInfo={projectInfo}
          isVisible={isModalVisible}
          isLoading={isJsonLoading}
          selectedContent={selectedPredictionContent}
          onClose={handleCloseModal}
          onDownloadCsv={handleDownloadHistory}
          simpleDataModalRef={simpleDataModalRef}
          multilabelModalRef={multilabelModalRef}
        />

        <DeployCloudServerCard deployData={deployData} />
      </div>
    </div>
  );
}
