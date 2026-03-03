import React from 'react'
import { Card, Statistic, Typography } from 'antd'
import {
	TrophyOutlined,
	ClockCircleOutlined,
	ExperimentOutlined,
} from '@ant-design/icons'

const { Text } = Typography

export function TrainResultSummaryCards({ metrics, experiment, epoch }) {
	const mainMetric = metrics[0]
	const totalMinutes = experiment.actual_training_time || 0
	const mins = Math.floor(totalMinutes)
	const secs = Math.round((totalMinutes - mins) * 60)

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Card className="rounded-xl border border-[var(--border)] [background:var(--card-gradient)] shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
				<Statistic
					title={
						<span className="font-poppins text-[var(--secondary-text)]">
							{`Final ${mainMetric?.metric ?? 'metric'} score`}
						</span>
					}
					value={(mainMetric?.value ?? 0) * 100}
					precision={2}
					prefix={
						<TrophyOutlined className="text-[var(--accent-text)]" />
					}
					suffix="%"
					valueStyle={{
						color: 'var(--accent-text)',
						fontFamily: 'Poppins, sans-serif',
						fontWeight: 'bold',
					}}
				/>
			</Card>

			<Card className="rounded-xl border border-[var(--border)] [background:var(--card-gradient)] shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
				<Statistic
					title={
						<span className="font-poppins text-[#94a3b8]">
							Training Duration
						</span>
					}
					valueRender={() => (
						<Text className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text font-poppins text-lg font-bold text-transparent">
							{mins}m {secs}s
						</Text>
					)}
					prefix={
						<ClockCircleOutlined className="text-[#f59e0b]" />
					}
				/>
			</Card>

			<Card className="rounded-xl border border-[var(--border)] [background:var(--card-gradient)] shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
				<Statistic
					title={
						<span className="font-poppins text-[#94a3b8]">
							Total Epochs
						</span>
					}
					value={epoch ?? 0}
					prefix={
						<ExperimentOutlined className="text-[#3b82f6]" />
					}
					valueStyle={{
						background:
							'linear-gradient(135deg, #3b82f6, #60a5fa)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						fontFamily: 'Poppins, sans-serif',
						fontWeight: 'bold',
					}}
				/>
			</Card>
		</div>
	)
}

