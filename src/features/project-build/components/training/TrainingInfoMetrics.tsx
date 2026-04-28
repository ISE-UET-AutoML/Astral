import React from 'react'
import { Card } from 'src/components/ui/card'
import { Badge as Tag } from 'src/components/ui/badge'
import { ChartBar as BarChartOutlined, Calendar as CalendarOutlined, LayoutDashboard as DashboardOutlined, FlaskConical as ExperimentOutlined } from 'lucide-react'
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
				<h2 className="m-0 flex items-center text-xl font-semibold text-gray-900 dark:text-white\">
					<DashboardOutlined className=\"mr-2 text-blue-500\" />
					<span>Experiment Information:</span>
					<Tag
						color=\"blue\"
						icon={<ExperimentOutlined />}
						className=\"ml-[10px] bg-blue-600 border-none text-white\"
					>
						{experimentName}
					</Tag>
				</h2>
			}
			className=\"border border-gray-300 dark:border-gray-700 rounded-xl transition-all duration-300 bg-white dark:bg-slate-900\"
		>
			<div className="flex w-full flex-col py-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<TrainingMetricCard
						title="Current Epoch"
						value={trainingInfo.latestEpoch}
						icon={<ExperimentOutlined />}
						loading={
							!trainingInfo.latestEpoch &&
							status === 'TRAINING'
						}
					/>
					<TrainingMetricCard
						title={`Validation ${valMetric}`}
						value={(trainingInfo.accuracy * 1).toFixed(2)}
						icon={<BarChartOutlined />}
						loading={
							!trainingInfo.accuracy && status === 'TRAINING'
						}
					/>
					<TrainingMetricCard
						title="Time Elapsed"
						value={elapsedTime}
						suffix="min"
						icon={<CalendarOutlined />}
						loading={status === 'PENDING'}
					/>
				</div>
			</div>
		</Card>
	)
}

