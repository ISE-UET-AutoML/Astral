import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import { ResponsiveContainer } from 'recharts'
import LineGraph from 'src/components/shared/charts/LineGraph'

export function TrainResultPerformanceCharts({ valGraphs }) {
	return (
		<Card className="rounded-xl border border-[var(--border)] [background:var(--card-gradient)] shadow-lg backdrop-blur-md">
			<CardHeader>
				<CardTitle className="font-poppins text-gray-900 dark:text-[#e2e8f0]">
					Training Performance
				</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{Object.entries(valGraphs).map(([metricName, metricData]) => (
					<div key={metricName}>
						<ResponsiveContainer width="100%" height={300}>
							<LineGraph
								data={metricData}
								label={
									<span className="text-gray-900 dark:text-white">
										{metricName.replace('_', ' ')} graph
									</span>
								}
							/>
						</ResponsiveContainer>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
