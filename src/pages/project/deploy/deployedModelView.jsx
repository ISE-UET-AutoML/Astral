import React from 'react'
import { useParams } from 'react-router-dom'
import { RocketLaunchIcon } from '@heroicons/react/24/outline'
import { useTheme } from 'src/theme/ThemeProvider'
import {
    DeploySummaryStats,
    DeployEndpointPanel,
    DeployMonitoringPanel,
    DeployHistorySection,
    DeployPredictionViewerModal,
    DeployCloudServerCard,
} from 'src/components/features/deploy'
import { useDeployView } from 'src/hooks/useDeployView'
// BackgroundShapes removed

export default function DeployedModelView() {
    const { theme } = useTheme()
    const { deployId, id: projectId } = useParams()

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
    } = useDeployView({ deployId, projectId, theme })

    return (
        <>
            <style>
                {`
                body, html {
                    background-color: var(--surface) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
            `}
            </style>
            <div className="p-6 min-h-screen bg-[var(--surface)]">
                <div className="flex flex-col w-full gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                            <RocketLaunchIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-[var(--text)]">
                                Deployment View
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-[var(--secondary-text)] mt-0.5">
                                Monitor and manage your deployed model
                            </p>
                        </div>
                    </div>

                    <DeploySummaryStats
                        deployData={deployData}
                        recentPredictions={recentPredictions}
                    />

                    {deployData?.status === 'ONLINE' && projectInfo && (
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

                    {deployData?.status === 'ONLINE' && projectInfo && (
                        <DeployMonitoringPanel
                            deployData={deployData}
                            projectInfo={projectInfo}
                            taskConfig={taskConfig}
                            onUploadFiles={handleUploadFiles}
                        />
                    )}


                    {deployData?.status === 'ONLINE' &&
                        !uploading &&
                        predictResult &&
                        projectInfo && (
                            <>
                                {(() => {
                                    if (taskConfig) {
                                        const PredictComponent =
                                            taskConfig.predictView
                                        return (
                                            <PredictComponent
                                                predictResult={predictResult}
                                                uploadedFiles={uploadedFiles}
                                                projectInfo={projectInfo}
                                                handleUploadFiles={
                                                    handleUploadFiles
                                                }
                                                model={model}
                                                s3_url={s3Url || deployData?.s3_url}
                                            />
                                        )
                                    }
                                    return null
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
        </>
    )
}
