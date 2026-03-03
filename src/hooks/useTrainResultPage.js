import * as React from 'react'
import { message } from 'antd'
import * as experimentAPI from 'src/api/experiment'
import * as mlServiceAPI from 'src/api/mlService'
import * as experimentConfigAPI from 'src/api/experiment_config'

const { useEffect, useState } = React

export const useTrainResultPage = ({
	experimentId,
	experimentName,
	projectId,
}) => {
	const [experiment, setExperiment] = useState({})
	const [metrics, setMetrics] = useState([])
	const [valGraphs, setValGraphs] = useState({})
	const [isDetailsExpanded, setIsDetailsExpanded] = useState(true)
	const [epoch, setEpoch] = useState(0)

	useEffect(() => {
		if (!experimentId) return

		const fetchExperiment = async () => {
			try {
				const experimentRes =
					await experimentAPI.getExperimentById(experimentId)
				if (experimentRes.status !== 200) {
					throw new Error('Cannot get experiment')
				}
				setExperiment(experimentRes.data)
			} catch (error) {
				console.error('Error while getting experiment', error)
			}
		}

		const fetchExperimentConfig = async () => {
			try {
				const experimentConfigRes =
					await experimentConfigAPI.getExperimentConfig(experimentId)
				if (experimentConfigRes.status !== 200) {
					throw new Error('Cannot get experiment config')
				}
				const history =
					experimentConfigRes.data[0].metrics.training_history
				setEpoch(history ? history.length : 0)
			} catch (error) {
				console.error(
					'Error while getting experiment config',
					error
				)
			}
		}

		const fetchExperimentMetrics = async () => {
			setMetrics([])
			try {
				const metricsRes =
					await mlServiceAPI.getFinalMetrics(experimentId)
				if (metricsRes.status !== 200) {
					throw new Error('Cannot get metrics')
				}

				const nextMetrics = Object.keys(metricsRes.data).map((key) => {
					const metric = metricsRes.data[key]
					return {
						key,
						metric: metric.name,
						value: metric.score,
						description: metric.description,
					}
				})
				setMetrics(nextMetrics)
			} catch (error) {
				console.error('Error while getting metrics', error)
			}
		}

		const fetchTrainingHistory = async () => {
			try {
				const res = await mlServiceAPI.getFitHistory(
					projectId,
					experimentName
				)
				const data = res.data

				if (data.error) {
					message.error(
						'An error occurred while fetching the training history.'
					)
					return
				}

				const graphs = {}
				for (const key of Object.keys(data)) {
					if (key === 'epoch') continue
					graphs[key] = data[key]
				}
				setValGraphs(graphs)
			} catch (error) {
				console.error('Error fetching training history:', error)
				message.error(
					'Failed to load training history. Please try again later.'
				)
			}
		}

		fetchExperiment()
		fetchExperimentMetrics()
		fetchTrainingHistory()
		fetchExperimentConfig()
	}, [experimentId, experimentName, projectId])

	return {
		experiment,
		metrics,
		valGraphs,
		isDetailsExpanded,
		setIsDetailsExpanded,
		epoch,
	}
}

