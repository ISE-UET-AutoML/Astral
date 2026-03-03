import React from 'react'
import { Typography } from 'antd'

const { Text } = Typography

export function InstanceMetricPill({ value, suffix }) {
	return (
		<div className="min-w-[125px] px-4 py-3 rounded-xl border text-center [background:var(--hover-bg)] border-[var(--border)]">
			<Text className="flex items-center justify-center gap-1 text-[16px] font-semibold text-[var(--text)]">
				<span>{value}</span>
				<span>{suffix}</span>
			</Text>
		</div>
	)
}

