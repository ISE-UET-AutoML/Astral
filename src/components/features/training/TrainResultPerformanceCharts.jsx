import React from 'react'
import { Card } from 'antd'
import { ResponsiveContainer } from 'recharts'
import LineGraph from 'src/components/shared/charts/LineGraph'

export function TrainResultPerformanceCharts({ valGraphs }) {
	return (
		<Card
			title={
				<span className="font-poppins text-[#e2e8f0]">
					Training Performance
				</span>
			}
			className="rounded-xl border border-[var(--border)] [background:var(--card-gradient)] shadow-lg backdrop-blur-md"
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{Object.entries(valGraphs).map(([metricName, metricData]) => (
					<div key={metricName}>
						<ResponsiveContainer width="100%" height={300}>
							<LineGraph
								data={metricData}
								label={
									<span className="text-white">
										{metricName.replace('_', ' ')} graph
									</span>
								}
							/>
						</ResponsiveContainer>
					</div>
				))}
			</div>
		</Card>
	)
}

