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

const buildExperimentCard = (item, responseData, configData) => {
	const status = responseData?.status || 'PENDING'
	const maxTrainingTime = responseData?.expected_training_time
		? responseData.expected_training_time / 60
		: null
	const chartData = configData?.metrics?.training_history || []
	const latestTrainingInfo =
		chartData.length > 0 ? chartData[chartData.length - 1] : null
	const elapsedTime = calculateElapsedTime(responseData?.start_time)
	const trainProgress =
		status === 'DONE'
			? 100
			: responseData?.expected_training_time
				? Math.min(
						(elapsedTime /
							(responseData.expected_training_time / 60)) *
							100,
						100
					)
				: 0

	return {
		tag: item.tag,
		experimentId: item.experimentId,
		experimentName: responseData?.name || item.experimentName || 'loading',
		status,
		maxTrainingTime,
		chartData,
		valMetric: configData?.metrics?.val_metric || 'Accuracy',
		trainingInfo: {
			latestEpoch: latestTrainingInfo?.step || 0,
			accuracy: latestTrainingInfo?.score || 0,
		},
		elapsedTime,
		trainProgress,
		currentStep: getCurrentStep(status),
		currentSettingUpStep: 0,
	}
}

export const useTrainingPage = ({ experiments = [] }) => {
	const [experimentCards, setExperimentCards] = useState([])
	const [loading, setLoading] = useState(true)

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
					Update system packages and apply the latest patches to
					ensure compatibility and security.
				</span>
			),
		},
		{
			title: <span className="text-[var(--text)]">Installing Tools</span>,
			description: (
				<span className="text-slate-400">
					Install essential development tools such as compilers,
					package managers, and utilities.
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
					Download and configure required libraries and frameworks
					from the requirements list.
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
					Uninstall or adjust conflicting packages to ensure smooth
					execution of the environment.
				</span>
			),
		},
	]

	useEffect(() => {
		if (!Array.isArray(experiments) || experiments.length === 0) {
			setExperimentCards([])
			setLoading(false)
			return
		}

		let timeoutId
		let isActive = true

		const fetchExperiments = async () => {
			try {
				const results = await Promise.all(
					experiments.map(async (item) => {
						if (
							!item?.experimentId ||
							item.experimentId === 'loading'
						) {
							return buildExperimentCard(item, null, null)
						}

						const [experimentResponse, configResponse] =
							await Promise.all([
								getExperimentById(item.experimentId),
								getExperimentConfig(item.experimentId),
							])

						return buildExperimentCard(
							item,
							experimentResponse.data,
							configResponse.data?.[0]
						)
					})
				)

				if (!isActive) return

				setExperimentCards(results)
				setLoading(false)

				if (results.some((item) => item.status !== 'DONE')) {
					timeoutId = setTimeout(fetchExperiments, 30000)
				}
			} catch (err) {
				if (!isActive) return
				console.error('Failed to fetch experiments:', err)
				message.error('Failed to fetch experiment status.')
				timeoutId = setTimeout(fetchExperiments, 30000)
			}
		}

		setLoading(true)
		fetchExperiments()

		return () => {
			isActive = false
			if (timeoutId) clearTimeout(timeoutId)
		}
	}, [experiments])

	const normalizedExperimentCards = useMemo(
		() =>
			experimentCards.map((item) => ({
				...item,
				enhancedChartData:
					!item.maxTrainingTime || item.chartData?.length === 0
						? item.chartData
						: item.chartData.map((point) => ({
								...point,
								threshold:
									point.time <= item.maxTrainingTime
										? null
										: 0,
							})),
			})),
		[experimentCards]
	)

	const primaryExperiment = normalizedExperimentCards[0] || null

	return {
		experimentCards: normalizedExperimentCards,
		primaryExperiment,
		loading,
		settingUpProgress,
	}
}
