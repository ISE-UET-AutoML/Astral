import React from 'react'
import { Spin, Typography } from 'antd'
import { LineChartOutlined } from '@ant-design/icons'
import {
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	Legend,
	ResponsiveContainer,
	Area,
	AreaChart,
} from 'recharts'

const { Text } = Typography

export function EnhancedLineGraph({ valMetric, data, loading, maxTrainingTime }) {
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64 w-full">
				<Spin size="large" tip="Loading chart data..." />
			</div>
		)
	}

	if (!data || data.length === 0) {
		return (
			<div className="flex justify-center items-center h-64 w-full border border-dashed border-slate-600/50 rounded-lg bg-slate-800/20">
				<div className="flex flex-col items-center gap-2">
					<LineChartOutlined className="text-5xl text-[#64748b]" />
					<Text
						type="secondary"
						className="text-[#94a3b8] font-poppins"
					>
						Waiting for training data...
					</Text>
				</div>
			</div>
		)
	}

	return (
		<ResponsiveContainer width="100%" height={300}>
			<AreaChart
				data={data}
				margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
			>
				<defs>
					<linearGradient
						id="colorAccuracy"
						x1="0"
						y1="0"
						x2="0"
						y2="1"
					>
						<stop
							offset="5%"
							stopColor="#60a5fa"
							stopOpacity={0.8}
						/>
						<stop
							offset="95%"
							stopColor="#22d3ee"
							stopOpacity={0.1}
						/>
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
				<XAxis
					dataKey="step"
					label={{
						value: 'Epoch (Step)',
						position: 'insideBottomRight',
						offset: -5,
						style: {
							fill: '#94a3b8',
							fontFamily: 'Poppins, sans-serif',
						},
					}}
					tick={{
						fontSize: 12,
						fill: '#94a3b8',
						fontFamily: 'Poppins, sans-serif',
					}}
					domain={[0, 'auto']}
				/>
				<YAxis
					label={{
						value: valMetric,
						angle: -90,
						position: 'insideLeft',
						style: {
							fill: '#94a3b8',
							fontFamily: 'Poppins, sans-serif',
						},
					}}
					domain={[0, 'auto']}
					tick={{
						fontSize: 12,
						fill: '#94a3b8',
						fontFamily: 'Poppins, sans-serif',
					}}
				/>
				<RechartsTooltip
					formatter={(value) => [
						`${(value * 1).toFixed(2)}`,
						valMetric,
					]}
					labelFormatter={(label) => `Epoch: ${label} step`}
					contentStyle={{
						backgroundColor: 'rgba(15, 23, 42, 0.95)',
						borderRadius: '8px',
						boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
						border: '1px solid var(--border)',
						color: '#e2e8f0',
						fontFamily: 'Poppins, sans-serif',
					}}
				/>
				<Legend />
				<Area
					type="monotone"
					dataKey="score"
					stroke="#60a5fa"
					strokeWidth={3}
					fillOpacity={1}
					fill="url(#colorAccuracy)"
					activeDot={{
						r: 8,
						stroke: '#60a5fa',
						strokeWidth: 2,
						fill: '#0f172a',
					}}
					name={`Validation ${valMetric}`}
				/>
				{maxTrainingTime && (
					<Line
						type="monotone"
						dataKey="threshold"
						stroke="transparent"
						strokeWidth={0}
						name="Max Training Time"
					/>
				)}
			</AreaChart>
		</ResponsiveContainer>
	)
}

