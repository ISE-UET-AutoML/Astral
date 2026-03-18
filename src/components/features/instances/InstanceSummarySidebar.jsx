import React from 'react'
import {
	GPU_LEVELS,
	CostEstimator,
	InstanceInfo,
} from 'src/constants/clouldInstance'

export function InstanceSummarySidebar({
	formData,
	isProcessing,
	onStartTraining,
}) {
	return (
		<div className="flex flex-col flex-1 min-h-0 w-full">
			<div className="flex-1 min-h-0 overflow-y-auto space-y-4">
				<InstanceInfo formData={formData} />
				<CostEstimator
					hours={formData.trainingTime}
					gpuLevel={GPU_LEVELS.find(
						(gpu) => gpu.name === formData.gpuName
					)}
				/>
			</div>
			<div className="shrink-0 pt-4">
				<button
					type="button"
					onClick={onStartTraining}
					disabled={!formData.trainingTime || isProcessing}
					className="w-full py-3 px-4 rounded-2xl font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 transition-colors border-0"
				>
					{isProcessing ? (
						<span className="inline-flex items-center justify-center gap-2">
							<svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
							</svg>
							Finding instance...
						</span>
					) : (
						'Start Training'
					)}
				</button>
			</div>
		</div>
	)
}


