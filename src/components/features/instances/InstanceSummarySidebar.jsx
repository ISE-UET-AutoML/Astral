import React from 'react'
import { Space } from 'antd'
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
		<Space direction="vertical" size="large" className="w-full">
			<InstanceInfo formData={formData} />
			<CostEstimator
				hours={formData.trainingTime}
				gpuLevel={GPU_LEVELS.find(
					(gpu) => gpu.name === formData.gpuName
				)}
				onStartTraining={onStartTraining}
				isProcessing={isProcessing}
				canStart={!!formData.trainingTime}
			/>
		</Space>
	)
}


