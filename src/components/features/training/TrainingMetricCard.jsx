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
		<Card className="h-max border border-[var(--border)] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-[var(--card-gradient)] backdrop-blur-md font-poppins">
			{loading ? (
				<Skeleton active paragraph={{ rows: 1 }} />
			) : (
				<div className="flex">
					<div className="text-lg font-medium text-gray-300 flex items-center">
						{icon && (
							<span className="mr-2 text-blue-400">{icon}</span>
						)}
						{title}
					</div>
					<div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent ml-8">
						{prefix && <span className="mr-1">{prefix}</span>}
						{typeof value === 'number'
							? value % 1 === 0
								? value
								: value.toFixed(2)
							: value}
						{suffix && <span className="ml-1">{suffix}</span>}
					</div>
				</div>
			)}
		</Card>
	)
}

