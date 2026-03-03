import React from 'react'
import { useParams } from 'react-router-dom'
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
        livePredictGradient,
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
                {/* BackgroundShapes removed */}
                <div className="flex flex-col w-full gap-6">
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
                        backgroundGradient={livePredictGradient}
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


                    <DeployCloudServerCard
                        deployData={deployData}
                        backgroundGradient={livePredictGradient}
                    />
                </div>
            </div>
        </>
    )
}
