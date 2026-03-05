import React from 'react'
import { Card, Statistic } from 'antd'
import { ClockCircleOutlined, HourglassOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

export function DeploySummaryStats({ deployData, recentPredictions }) {
	if (!deployData) return null

	const minutesDiff = dayjs().diff(dayjs(deployData?.created_at), 'minute')
	const hours = Math.floor(minutesDiff / 60)
	const minutes = minutesDiff % 60

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Card
					className="shadow-md border border-[var(--border)] rounded-xl [background:var(--card-gradient)]"
					style={{
						backdropFilter: 'blur(10px)',
						fontFamily: 'Poppins, sans-serif',
					}}
				>
					<Statistic
						title={
							<span className="font-poppins text-[var(--secondary-text)]">
								Uptime
							</span>
						}
						value={`${hours} hour(s) ${minutes} minute(s)`}
						valueStyle={{
							color: 'var(--deploy-uptime-color)',
						}}
						prefix={<ClockCircleOutlined className="text-[var(--deploy-uptime-color)]" />}
					/>
				</Card>
			</div>
			<div>
				<Card
					className="shadow-md border border-[var(--border)] rounded-xl [background:var(--card-gradient)]"
					style={{
						backdropFilter: 'blur(10px)',
						fontFamily: 'Poppins, sans-serif',
					}}
				>
					<Statistic
						title={
							<span className="font-poppins text-[var(--secondary-text)]">
								Total Predictions
							</span>
						}
						value={recentPredictions?.length || 0}
						prefix={<HourglassOutlined className="text-[var(--deploy-total-color)]" />}
						valueStyle={{
							color: 'var(--deploy-total-color)',
						}}
					/>
				</Card>
			</div>
		</div>
	)
}

