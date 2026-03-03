import React from 'react'

const MetaDataItem = ({ label, value }) => (
	<div className="flex flex-col space-y-1 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-4 transition-all duration-200 hover:bg-white/10">
		<span className="text-xs font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-60">
			{label}
		</span>
		<span className="text-sm font-semibold text-[var(--text)]">
			{value}
		</span>
	</div>
)

export default MetaDataItem

