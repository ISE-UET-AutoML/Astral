import React from 'react'
import { CustomSelect, Option } from 'src/components/ui/custom-select'

const Select = ({ options = [], ...props }) => (
	<CustomSelect {...props}>
		{options.map((option) => (
			<Option key={option.value} value={option.value}>
				{option.label}
			</Option>
		))}
	</CustomSelect>
)

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
		/>
	)
}
