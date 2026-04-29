import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

type LineGraphProps = {
	data: Array<Record<string, unknown>>
}

const LineGraph = ({ data }: LineGraphProps) => (
	<>
		{data.length > 0 && (
			<div className="h-[250px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={data}
						margin={{
							top: 5,
							right: 16,
							left: 0,
							bottom: 24,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="step"
							label={{
								value: 'Step',
								position: 'insideBottom',
								offset: -8,
							}}
						/>
						<YAxis />
						<Tooltip />
						<Line
							type="monotone"
							dataKey="value"
							stroke="#4e80ee"
							strokeWidth="3"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		)}
	</>
)

export default LineGraph
