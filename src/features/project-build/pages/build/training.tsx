import React from 'react'
import { useLocation, useOutletContext, useNavigate } from 'react-router-dom'
import { Card } from 'src/components/ui/card'
import { Badge as Tag } from 'src/components/ui/badge'
import { useSpring, animated } from '@react-spring/web'
import { PATHS } from 'src/constants/paths'
import { useTrainingPage } from 'src/features/project-build/hooks/useTrainingPage'
import { TrainingProgressSteps } from 'src/features/project-build/components/training/TrainingProgressSteps'
import { TrainingCharts } from 'src/features/project-build/components/training/TrainingCharts'

const parseExperiments = (searchParams) => {
	const experimentId = searchParams.get('experimentId')
	const experimentName = searchParams.get('experimentName') || 'loading'
	const rawExperiments = searchParams.get('experiments')

	if (rawExperiments) {
		try {
			const parsed = JSON.parse(rawExperiments)
			if (Array.isArray(parsed) && parsed.length > 0) {
				return parsed
			}
		} catch (error) {
			console.warn('Failed to parse experiments query param', error)
		}
	}

	if (experimentId) {
		return [{ experimentId, experimentName }]
	}

	return []
}

const Training = () => {
	const { projectInfo } = useOutletContext()
	const navigate = useNavigate()
	const location = useLocation()
	const experiments = React.useMemo(
		() => parseExperiments(new URLSearchParams(location.search)),
		[location.search]
	)
	const { experimentCards, primaryExperiment, loading, settingUpProgress } =
		useTrainingPage({ experiments })
	const metricExplain = projectInfo.metrics_explain
	const isSingleExperiment = experimentCards.length <= 1

	const handleViewResults = (experiment) => {
		navigate(
			PATHS.PROJECT_TRAININGRESULT(
				projectInfo.id,
				experiment.experimentId,
				experiment.experimentName
			)
		)
	}

	return (
		<div className="min-h-0 bg-[var(--surface)] font-poppins">
			<div className="relative z-10 w-full px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
				<animated.div
					style={useSpring({
						from: { opacity: 0, transform: 'translateY(20px)' },
						to: { opacity: 1, transform: 'translateY(0)' },
						config: { tension: 280, friction: 20 },
					})}
				>
					<div className="flex w-full flex-col gap-6">
						{experimentCards.map((experiment) => (
							<Card
								key={`${experiment.tag || 'default'}-${experiment.experimentId}`}
								className="border border-[var(--border)] rounded-xl backdrop-blur-md shadow-lg bg-[var(--card-gradient)] font-poppins"
								title={
									<div className="flex items-center justify-between gap-3">
										<span className="text-lg font-semibold text-[var(--text)]">
											{experiment.experimentName ===
											'loading'
												? `Preparing ${String(
														experiment.tag ||
															'training'
													).toUpperCase()}`
												: experiment.experimentName}
										</span>
										{experiment.tag && (
											<Tag
												color="blue"
												className="uppercase"
											>
												{experiment.tag}
											</Tag>
										)}
									</div>
								}
							>
								<TrainingProgressSteps
									currentStep={experiment.currentStep}
									status={experiment.status}
									experimentName={experiment.experimentName}
									maxTrainingTime={experiment.maxTrainingTime}
									elapsedTime={experiment.elapsedTime}
									onViewResults={() =>
										handleViewResults(experiment)
									}
									currentSettingUpStep={
										experiment.currentSettingUpStep
									}
									settingUpProgress={settingUpProgress}
								/>
							</Card>
						))}

						{loading && experimentCards.length === 0 && (
							<Card className="border border-[var(--border)] rounded-xl bg-[var(--card-gradient)]">
								<p className="m-0 text-[var(--secondary-text)]">
									Preparing training status...
								</p>
							</Card>
						)}

						{isSingleExperiment &&
							primaryExperiment &&
							primaryExperiment.currentStep >= 3 && (
								<TrainingCharts
									currentStep={primaryExperiment.currentStep}
									valMetric={primaryExperiment.valMetric}
									maxTrainingTime={
										primaryExperiment.maxTrainingTime
									}
									enhancedChartData={
										primaryExperiment.enhancedChartData
									}
									loading={loading}
									hasChartData={
										primaryExperiment.chartData?.length > 0
									}
									experimentId={
										primaryExperiment.experimentId
									}
									experimentName={
										primaryExperiment.experimentName
									}
									trainingInfo={
										primaryExperiment.trainingInfo
									}
									elapsedTime={primaryExperiment.elapsedTime}
									status={primaryExperiment.status}
									onViewResults={() =>
										handleViewResults(primaryExperiment)
									}
									trainProgress={
										primaryExperiment.trainProgress
									}
									metricExplain={metricExplain}
								/>
							)}
					</div>
				</animated.div>
			</div>
		</div>
	)
}

export default Training
