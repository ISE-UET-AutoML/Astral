import * as React from 'react'
import { message } from 'antd'
import { getExperimentById } from 'src/api/experiment'
import { getExperimentConfig } from 'src/api/experiment_config'

const { useState, useEffect, useMemo } = React

const calculateElapsedTime = (startTimeValue) => {
	if (!startTimeValue) return 0

	const start = new Date(startTimeValue)
	const currentTime = new Date()
	return ((currentTime - start) / (1000 * 60)).toFixed(2)
}

const getCurrentStep = (status) => {
	switch (status) {
		case 'SELECTING_INSTANCE':
			return 0
		case 'SETTING_UP':
			return 1
		case 'DOWNLOADING_DATA':
			return 2
		case 'TRAINING':
			return 3
		case 'DONE':
			return 4
		default:
			return 0
	}
}

export const useTrainingPage = ({ experimentId, initialExperimentName }) => {
	const [trainingInfo, setTrainingInfo] = useState({
		latestEpoch: 0,
		accuracy: 0,
	})
	const [valMetric, setValMetric] = useState('Accuracy')
	const [chartData, setChartData] = useState([])
	const [elapsedTime, setElapsedTime] = useState(0)
	const [status, setStatus] = useState('PENDING')
	const [loading, setLoading] = useState(true)
	const [maxTrainingTime, setMaxTrainingTime] = useState(null)
	const [trainProgress, setTrainProgress] = useState(0)
	const [currentStep, setCurrentStep] = useState(0)
	const [currentSettingUpStep, setCurrentSettingUpStep] = useState(0)
	const [experimentName, setExperimentName] = useState(
		initialExperimentName || 'loading'
	)

	const settingUpProgress = [
		{
			title: (
				<span className="text-[var(--text)]">
					Initialize Virtual Environment
				</span>
			),
			description: (
				<span className="text-slate-400">
					Set up a clean Python virtual environment to isolate project
					dependencies and prevent conflicts.
				</span>
			),
		},
		{
			title: (
				<span className="text-[var(--text)]">
					Updating Operating System
				</span>
			),
			description: (
				<span className="text-slate-400">
					Update system packages and apply the latest patches to ensure
					compatibility and security.
				</span>
			),
		},
		{
			title: (
				<span className="text-[var(--text)]">Installing Tools</span>
			),
			description: (
				<span className="text-slate-400">
					Install essential development tools such as compilers, package
					managers, and utilities.
				</span>
			),
		},
		{
			title: (
				<span className="text-[var(--text)]">
					Installing Dependencies
				</span>
			),
			description: (
				<span className="text-slate-400">
					Download and configure required libraries and frameworks from the
					requirements list.
				</span>
			),
		},
		{
			title: (
				<span className="text-[var(--text)]">
					Cleaning up conflicting packages
				</span>
			),
			description: (
				<span className="text-slate-400">
					Uninstall or adjust conflicting packages to ensure smooth execution
					of the environment.
				</span>
			),
		},
	]

	// Fake "setting up" step progression
	useEffect(() => {
		if (currentStep !== 1) return
		const stepCount = settingUpProgress.length

		const interval = setInterval(() => {
			setCurrentSettingUpStep((prev) => {
				if (prev < stepCount - 1) {
					return prev + 1
				}
				clearInterval(interval)
				return prev
			})
		}, 60000)

		return () => clearInterval(interval)
	}, [currentStep])

	// Poll experiment status & config
	useEffect(() => {
		let timeoutId

		const fetchExperiment = async () => {
			if (!experimentId || experimentId === 'loading') {
				setStatus('SELECTING_INSTANCE')
				setCurrentStep(0)
				setLoading(false)
				return
			}

			try {
				const response = await getExperimentById(experimentId)
				if (
					response.data.name &&
					response.data.name !== experimentName
				) {
					setExperimentName(response.data.name)
				}

				const configResponse = await getExperimentConfig(experimentId)
				const config = configResponse.data[0]

				setStatus(response.data.status)
				setCurrentStep(getCurrentStep(response.data.status))
				setMaxTrainingTime(
					response.data.expected_training_time
						? response.data.expected_training_time / 60
						: null
				)
				setChartData(
					config.metrics?.training_history
						? config.metrics.training_history
						: []
				)

				const latestTrainingInfo =
					config.metrics?.training_history?.[
						config.metrics.training_history.length - 1
					]
				setTrainingInfo({
					latestEpoch: latestTrainingInfo?.step || 0,
					accuracy: latestTrainingInfo?.score || 0,
				})

				setValMetric(
					config.metrics?.val_metric
						? config.metrics.val_metric
						: 'Accuracy'
				)

				const elapsed = calculateElapsedTime(response.data.start_time)
				const progress = response.data.expected_training_time
					? Math.min(
							(elapsed /
								(response.data.expected_training_time / 60)) *
								100,
							100
						)
					: 0

				setElapsedTime(elapsed)
				setTrainProgress(
					response.data.status === 'DONE' ? 100 : progress
				)

				if (response.data.status !== 'DONE') {
					timeoutId = setTimeout(fetchExperiment, 30000)
				} else {
					setLoading(false)
				}
			} catch (err) {
				console.error('Failed to fetch experiment:', err)
				message.error('Failed to fetch experiment status.')
				timeoutId = setTimeout(fetchExperiment, 30000)
			}
		}

		fetchExperiment()

		return () => {
			if (timeoutId) clearTimeout(timeoutId)
		}
	}, [experimentId, experimentName])

	// Chart data with threshold reference
	const enhancedChartData = useMemo(() => {
		if (!maxTrainingTime || chartData?.length === 0) return chartData

		return chartData.map((point) => ({
			...point,
			threshold: point.time <= maxTrainingTime ? null : 0,
		}))
	}, [chartData, maxTrainingTime])

	return {
		// state
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
	}
}

