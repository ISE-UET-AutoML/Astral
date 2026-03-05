import React from 'react'
import { Typography } from 'antd'

const { Text } = Typography

export function InstanceMetricPill({ value, suffix }) {
	return (
		<div className="shrink-0 min-w-[100px] px-4 py-2.5 rounded-lg border text-center [background:var(--hover-bg)] border-[var(--border)]">
			<Text className="flex items-center justify-center gap-1 text-[15px] font-semibold text-[var(--text)]">
				<span>{value}</span>
				<span className="text-[var(--secondary-text)]">{suffix}</span>
			</Text>
		</div>
	)
}

