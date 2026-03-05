import React from 'react'
import { Button, Space } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
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
		<>
			<Space direction="vertical" size="large" className="w-full">
				<InstanceInfo formData={formData} />
				<CostEstimator
					hours={formData.trainingTime}
					gpuLevel={GPU_LEVELS.find(
						(gpu) => gpu.name === formData.gpuName
					)}
				/>
			</Space>
			<div className="action-container mt-4 w-full flex justify-end items-center">
				<button
					type="primary"
					size="large"
					icon={<ThunderboltOutlined />}
					onClick={onStartTraining}
					loading={isProcessing}
					disabled={!formData.trainingTime || isProcessing}
					className="bg-blue-500 text-white p-3 rounded-xl"
				>
					{isProcessing ? 'Finding instance...' : 'Start Training'}
				</button>
			</div>
		</>
	)
}


