import React from 'react'
import { Select } from 'antd'
import { TrainingTask } from 'src/constants/trainingTasks'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { SortDropdown, ProjectSearchBar } from 'src/components/projects'

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
		<div className="mb-6 p-4 rounded-xl backdrop-blur-sm transition-all duration-300 bg-gray-50/80 dark:bg-white/5 border border-gray-200 dark:border-white/10">
			<div className="flex flex-wrap gap-3 items-end">
				{/* Search */}
				<div className="flex-1 min-w-[200px]">
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
							className="!h-10"
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
						className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all duration-200 text-gray-700 dark:text-gray-300 bg-blue-500/5 dark:bg-blue-400/10 hover:bg-blue-500/10 dark:hover:bg-blue-400/20 border border-gray-200 dark:border-white/10"
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