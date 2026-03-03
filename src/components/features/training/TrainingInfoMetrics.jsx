import React from 'react'
import { Card, Tag } from 'antd'
import {
	BarChartOutlined,
	CalendarOutlined,
	DashboardOutlined,
	ExperimentOutlined,
} from '@ant-design/icons'
import { TrainingMetricCard } from './TrainingMetricCard'

export function TrainingInfoMetrics({
	valMetric,
	experimentName,
	trainingInfo,
	elapsedTime,
	status,
}) {
	return (
		<Card
			title={
				<h2 className="m-0 flex items-center text-xl font-semibold font-poppins text-[var(--text)]">
					<DashboardOutlined className="mr-2 text-[#60a5fa]" />
					<span>Experiment Information:</span>
					<Tag
						color="blue"
						icon={<ExperimentOutlined />}
						className="ml-[10px] bg-gradient-to-br from-[#3b82f6] to-[#22d3ee] border-none text-white font-poppins"
					>
						{experimentName}
					</Tag>
				</h2>
			}
			className="border border-[var(--border)] rounded-xl backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 bg-[var(--card-gradient)] font-poppins"
		>
			<div className="flex w-full flex-col gap-4">
				<div className="flex flex-wrap gap-4">
					<div className="w-full md:w-[28%]">
						<TrainingMetricCard
							title="Current Epoch"
							value={trainingInfo.latestEpoch}
							icon={<ExperimentOutlined />}
							loading={
								!trainingInfo.latestEpoch &&
								status === 'TRAINING'
							}
						/>
					</div>
					<div className="ml-0 w-full md:ml-10 md:w-[28%]">
						<TrainingMetricCard
							title={`Validation ${valMetric}`}
							value={(trainingInfo.accuracy * 1).toFixed(2)}
							icon={<BarChartOutlined />}
							loading={
								!trainingInfo.accuracy && status === 'TRAINING'
							}
						/>
					</div>
					<div className="ml-0 w-full md:ml-10 md:w-[28%]">
						<TrainingMetricCard
							title="Time Elapsed"
							value={elapsedTime}
							suffix="min"
							icon={<CalendarOutlined />}
							loading={status === 'PENDING'}
						/>
					</div>
				</div>
			</div>
		</Card>
	)
}

