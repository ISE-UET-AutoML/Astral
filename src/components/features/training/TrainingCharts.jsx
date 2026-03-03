import React from 'react'
import { Alert, Card, Tag, Tooltip, Typography } from 'antd'
import {
	HourglassOutlined,
	LineChartOutlined,
	RadarChartOutlined,
} from '@ant-design/icons'
import { EnhancedLineGraph } from './EnhancedLineGraph'
import { TrainingInfoMetrics } from './TrainingInfoMetrics'

const { Paragraph, Text } = Typography

export function TrainingCharts({
	currentStep,
	valMetric,
	maxTrainingTime,
	enhancedChartData,
	loading,
	hasChartData,
	experimentId,
	experimentName,
	trainingInfo,
	elapsedTime,
	status,
	onViewResults,
	trainProgress,
	metricExplain,
}) {
	if (currentStep < 3) return null

	return (
		<Card
			title={
				<h2 className="m-0 flex items-center text-xl font-semibold font-poppins text-[var(--text)]">
					<LineChartOutlined className="mr-2 text-[var(--accent-text)]" />
					{`${valMetric ? valMetric : 'Accuracy'} Trend`}
				</h2>
			}
			className="border border-[var(--border)] rounded-xl backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 bg-[var(--card-gradient)] font-poppins"
			extra={
				maxTrainingTime ? (
					<Tag
						color="orange"
						icon={<HourglassOutlined />}
						className="bg-gradient-to-br from-[#f59e0b] to-[#f97316] border-none text-white font-poppins"
					>
						Time Limit: {maxTrainingTime.toFixed(2)} min
					</Tag>
				) : null
			}
		>
			<EnhancedLineGraph
				valMetric={valMetric}
				data={enhancedChartData}
				loading={loading && !hasChartData}
				maxTrainingTime={maxTrainingTime}
			/>

			<div className="my-5">
				<TrainingInfoMetrics
					valMetric={valMetric}
					experimentName={
						experimentName === 'loading'
							? 'Finding Instance...'
							: experimentName
					}
					trainingInfo={trainingInfo}
					elapsedTime={elapsedTime}
					status={status}
				/>
			</div>

			<Alert
				description={
					<div>
						<Paragraph className="!m-0 font-poppins">
							<RadarChartOutlined className="mr-2 text-[#60a5fa]" />
							<Text strong className="font-poppins text-[var(--text)]">
								Understand Metrics:
							</Text>{' '}
							<Text className="font-poppins text-[var(--text)]">
								{metricExplain}
							</Text>
						</Paragraph>

						{maxTrainingTime && (
							<Paragraph className="mt-3 font-poppins">
								<Tooltip title="Time constraints can affect model performance">
									<HourglassOutlined className="mr-2 text-[#f59e0b]" />
									<Text strong className="font-poppins text-[var(--text)]">
										Training Time Limit:
									</Text>{' '}
									<Text className="font-poppins text-[var(--text)]">
										This experiment has a maximum training time of{' '}
										{maxTrainingTime.toFixed(2)} minutes. If the training doesn't
										converge within this time, consider adjusting model
										complexity or training parameters.
									</Text>
								</Tooltip>
							</Paragraph>
						)}
					</div>
				}
				type="info"
				className="border border-[rgba(59,130,246,0.3)] rounded-xl font-poppins bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(34,211,238,0.1))]"
			/>
		</Card>
	)
}

