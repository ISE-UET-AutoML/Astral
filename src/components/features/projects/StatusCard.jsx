import React from 'react'

const StatusCard = ({ label, value, Icon }) => (
	<div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] border-opacity-20 bg-[linear-gradient(135deg,var(--hover-bg)_0%,rgba(255,255,255,0.02)_100%)] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-opacity-40 hover:shadow-xl">
		<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
		<div className="relative flex items-center space-x-4 p-6">
			<div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-white/10 to-white/5 p-3 backdrop-blur-sm">
				<Icon className="text-2xl text-[var(--accent-text)] transition-transform duration-300 group-hover:scale-110" />
			</div>
			<div className="min-w-0 flex-1">
				<p className="mb-1 text-sm font-medium text-[var(--secondary-text)] opacity-70">
					{label}
				</p>
				<p className="text-2xl font-bold tracking-tight text-[var(--text)]">
					{value}
				</p>
			</div>
		</div>
	</div>
)

export default StatusCard

