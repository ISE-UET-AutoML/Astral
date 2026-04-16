import React, { useEffect } from 'react'
import { ClockCircleOutlined, HourglassOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

function StatCard({ icon, label, value, sub, accentClass }) {
	return (
		<div
			className="flex flex-1 items-center gap-5 rounded-2xl border border-[var(--border)] [background:var(--card-gradient)] px-7 py-6 shadow-sm backdrop-blur-md"
		>
			<div
				className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${accentClass}`}
			>
				{icon}
			</div>
			<div className="min-w-0">
				<p className="mb-1 text-sm font-medium uppercase tracking-widest text-[var(--secondary-text)]">
					{label}
				</p>
				<p className="truncate text-3xl font-bold leading-none text-[var(--text)]">
					{value}
				</p>
				{sub && (
					<p className="mt-1 text-xs text-[var(--secondary-text)]">{sub}</p>
				)}
			</div>
		</div>
	)
}

export function DeploySummaryStats({ deployData, recentPredictions }) {
	useEffect(() => {
		if (deployData) {
			console.log('[DeploySummaryStats] deployData payload:', deployData)
		}
	}, [deployData])

	if (!deployData) return null

	const createTime = deployData?.create_time ?? deployData?.created_at
	const minutesDiff = createTime ? dayjs().diff(dayjs(createTime), 'minute') : 0
	const hours = Math.floor(minutesDiff / 60)
	const minutes = minutesDiff % 60

	const uptimeValue =
		hours > 0
			? `${hours}h ${minutes}m`
			: `${minutes} min`

	const totalPredictions = recentPredictions?.length ?? 0

	return (
		<div className="flex flex-col gap-4 sm:flex-row">
			<StatCard
				icon={<ClockCircleOutlined />}
				label="Uptime"
				value={uptimeValue}
				sub={createTime ? `Since ${dayjs(createTime).format('MMM D, HH:mm')}` : null}
				accentClass="bg-amber-500/10 text-amber-500"
			/>
			<StatCard
				icon={<HourglassOutlined />}
				label="Total Predictions"
				value={totalPredictions.toLocaleString()}
				sub={totalPredictions === 0 ? 'No predictions yet' : `${totalPredictions} request${totalPredictions > 1 ? 's' : ''} served`}
				accentClass="bg-blue-500/10 text-blue-500"
			/>
		</div>
	)
}
