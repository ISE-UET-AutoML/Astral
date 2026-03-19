import React from 'react'
import { Card, Skeleton } from 'antd'

export function TrainingMetricCard({
	title,
	value,
	prefix,
	suffix,
	loading,
	icon,
}) {
	return (
		<Card className="h-max w-full border border-[var(--border)] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-[var(--card-gradient)] backdrop-blur-md font-poppins">
			{loading ? (
				<Skeleton active paragraph={{ rows: 1 }} />
			) : (
				<div className="flex w-full items-center justify-between gap-4">
					<span className="text-lg font-medium text-gray-900 dark:text-white flex items-center shrink-0">
						{icon && (
							<span className="mr-2 text-blue-400 shrink-0">{icon}</span>
						)}
						{title}
					</span>
					<span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent shrink-0 text-right">
						{prefix && <span className="mr-1">{prefix}</span>}
						{typeof value === 'number'
							? value % 1 === 0
								? value
								: value.toFixed(2)
							: value}
						{suffix && <span className="ml-1">{suffix}</span>}
					</span>
				</div>
			)}
		</Card>
	)
}

