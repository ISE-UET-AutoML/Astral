import React from 'react'

export default function ProjectSearchBar({ onSearch, isReset, compact = false, searchValue }) {
	const [onSearchValue, setOnSearchValue] = React.useState(searchValue)

	const handleChange = (e) => {
		const value = e.target.value
		setOnSearchValue(value)
		onSearch(value)
	}

	React.useEffect(() => {
		setOnSearchValue(searchValue)
	}, [isReset, searchValue])

	return (
		<div className={compact ? '' : 'mb-6'}>
			<input
				type="text"
				placeholder="Search projects..."
				value={onSearchValue || ''}
				onChange={handleChange}
				className="w-full h-10 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
			/>
		</div>
	)
}