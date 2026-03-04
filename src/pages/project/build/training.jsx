import React from 'react'
import { useLocation, useOutletContext, useNavigate } from 'react-router-dom'
import { Card, Alert, Typography, Tag, Spin, Skeleton, Button, Tooltip } from 'antd'
import {
	ExperimentOutlined,
	LineChartOutlined,
	CheckCircleOutlined,
	DatabaseOutlined,
	BarChartOutlined,
	DashboardOutlined,
	CalendarOutlined,
	HourglassOutlined,
	RadarChartOutlined,
	SettingOutlined,
	CloudDownloadOutlined,
	LoadingOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons'
import { useSpring, animated } from '@react-spring/web'
import { PATHS } from 'src/constants/paths'
import { useTrainingPage } from 'src/hooks/useTrainingPage'
import { TrainingProgressSteps } from 'src/components/features/training/TrainingProgressSteps'
import { TrainingCharts } from 'src/components/features/training/TrainingCharts'

// import { calcGeneratorDuration } from 'framer-motion'

const { Text, Paragraph } = Typography

// Main Component
const Training = () => {
	const { projectInfo } = useOutletContext()
	const navigate = useNavigate()
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const experimentId = searchParams.get('experimentId')
	const initialExperimentName =
		searchParams.get('experimentName') || 'loading'

	const {
		trainingInfo,
		valMetric,
		chartData,
		enhancedChartData,
		elapsedTime,
		status,
		loading,
		maxTrainingTime,
		trainProgress,
		currentStep,
		currentSettingUpStep,
		experimentName,
		setExperimentName,
		setStatus,
		setCurrentStep,
		setLoading,
		setMaxTrainingTime,
		setChartData,
		setTrainingInfo,
		setValMetric,
		setElapsedTime,
		setTrainProgress,
		setCurrentSettingUpStep,
		settingUpProgress,
	} = useTrainingPage({ experimentId, initialExperimentName })

	const metricExplain = projectInfo.metrics_explain

	// Handle view results button click
	const handleViewResults = () => {
		navigate(
			PATHS.PROJECT_TRAININGRESULT(
				projectInfo.id,
				experimentId,
				experimentName
			)
		)
	}


	return (
		<>
			<div className="relative min-h-screen bg-[var(--surface)] font-poppins">
				{/* BackgroundShapes removed */}
				<div className="relative z-10 p-6">
					<animated.div
						style={useSpring({
							from: { opacity: 0, transform: 'translateY(20px)' },
							to: { opacity: 1, transform: 'translateY(0)' },
							config: { tension: 280, friction: 20 },
						})}
					>
						<div className="flex w-full flex-col gap-6">
							<TrainingProgressSteps
								currentStep={currentStep}
								status={status}
								experimentName={experimentName}
								maxTrainingTime={maxTrainingTime}
								elapsedTime={elapsedTime}
								onViewResults={handleViewResults}
								currentSettingUpStep={currentSettingUpStep}
								settingUpProgress={settingUpProgress}
							/>
							{currentStep >= 3 && (
								<TrainingCharts
									currentStep={currentStep}
									valMetric={valMetric}
									maxTrainingTime={maxTrainingTime}
									enhancedChartData={enhancedChartData}
									loading={loading}
									hasChartData={chartData?.length > 0}
									experimentId={experimentId}
									experimentName={experimentName}
									trainingInfo={trainingInfo}
									elapsedTime={elapsedTime}
									status={status}
									onViewResults={handleViewResults}
									trainProgress={trainProgress}
									metricExplain={metricExplain}
								/>
							)}
						</div>
					</animated.div>
				</div>
			</div>
		</>
	)
}

export default Training
