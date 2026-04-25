import React from 'react'
import { CustomSelect, Option } from 'src/components/ui/custom-select'
import { TrainingTask } from 'src/constants/trainingTasks'
import { X as XMarkIcon } from 'lucide-react'
import { SortDropdown, ProjectSearchBar } from 'src/features/projects/components'

const Select = ({ options = [], ...props }) => (
	<CustomSelect {...props}>
		{options.map((option) => (
			<Option key={option.value} value={option.value}>
				{option.label}
			</Option>
		))}
	</CustomSelect>
)

const trainingTaskOptions = Object.values(TrainingTask).map((task) => ({
	value: task,
	label: <span className="font-medium">{task.replace(/_/g, ' ')}</span>,
}))

const TaskFilter = ({
	selectedTrainingTask,
	onTaskChange,
	onReset,
	onSearch,
	selectedSort,
	onSortChange,
	isReset,
	searchValue,
}) => {
	return (
		<div className="mb-6 p-4 shadow-lg rounded-xl backdrop-blur-sm transition-all duration-300 bg-gray-50/80 dark:bg-white/5 border border-gray-200 dark:border-white/10">
			<div className="flex flex-wrap gap-3 items-end">
				{/* Search */}
				<div className="flex-1 ">
					<ProjectSearchBar onSearch={onSearch} isReset={isReset} compact searchValue={searchValue} />
				</div>

				{/* Task Type Filter */}
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">Type:</span>
					<div className="min-w-[160px]">
						<Select
							key="task"
							options={trainingTaskOptions}
							value={selectedTrainingTask}
							placeholder="Select task type"
							className="w-full"
							onChange={onTaskChange}
							allowClear
							size="default"
						/>
					</div>
				</div>

				{/* Sort */}
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">Sort by:</span>
					<div className="min-w-[140px]">
						<SortDropdown selectedSort={selectedSort} onSortChange={onSortChange} />
					</div>
				</div>
			</div>

			{(selectedTrainingTask || searchValue !== '' || selectedSort !== 'latest') && (
				<div className="flex justify-end pt-2">
					<button
						onClick={onReset}
						className="px-2 py-2 rounded-xl flex items-center gap-2 text-sm transition-all duration-200 text-white dark:text-gray-300 dark:bg-blue-300/10 hover:bg-blue-500/10 dark:hover:bg-blue-400/20 border border-gray-200 dark:border-white/10 bg-blue-500 hover:bg-blue-600"
					>
						<XMarkIcon className="h-4 w-4" />
						Reset Filters
					</button>
				</div>
			)}
		</div>
	)
}

export default TaskFilter
