import React from 'react'

const StatusCard = ({ label, value, Icon }) => (
	<div
		className="group relative overflow-hidden rounded-2xl border border-opacity-20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-opacity-40 hover:shadow-xl"
		style={{
			borderColor: 'var(--border)',
			background: 'linear-gradient(135deg, var(--hover-bg) 0%, rgba(255,255,255,0.02) 100%)',
		}}
	>
		<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
		<div className="relative flex items-center space-x-3 p-4 lg:p-5">
			<div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-white/10 to-white/5 p-2.5 backdrop-blur-sm">
				<Icon
					className="text-xl transition-transform duration-300 group-hover:scale-110"
					style={{ color: 'var(--accent-text)' }}
				/>
			</div>
			<div className="min-w-0 flex-1">
				<p
					className="mb-1 text-xs lg:text-sm font-medium opacity-70"
					style={{ color: 'var(--secondary-text)' }}
				>
					{label}
				</p>
				<p
					className="text-xl lg:text-2xl font-bold tracking-tight"
					style={{ color: 'var(--text)' }}
				>
					{value}
				</p>
			</div>
		</div>
	</div>
)

export default StatusCard
