import React from 'react'
import { Select } from 'antd'

const SORT_OPTIONS = [
	{ value: 'latest', label: 'Latest' },
	{ value: 'oldest', label: 'Oldest' },
	{ value: 'name_asc', label: 'Name (A-Z)' },
	{ value: 'name_desc', label: 'Name (Z-A)' },
]

export default function SortDropdown({ selectedSort, onSortChange }) {
	return (
		<Select
			options={SORT_OPTIONS}
			value={selectedSort || 'latest'}
			placeholder="Sort by"
			className="w-full"
			onChange={onSortChange}
			style={{ minWidth: 140, height: 40 }}
		/>
	)
}