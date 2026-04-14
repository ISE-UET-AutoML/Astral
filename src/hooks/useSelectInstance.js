import * as React from 'react'
import { message } from 'antd'
import { trainCloudModel } from 'src/api/mlService'
import { createDownZipPU } from 'src/api/dataset'
import { createInstance, deleteInstance } from 'src/api/resource'
import {
	SERVICES,
	GPU_LEVELS,
	generateRandomKey,
} from 'src/constants/clouldInstance'

const { useState, useEffect } = React

export const useSelectInstance = ({
	projectInfo,
	selectedProject,
	updateFields,
	navigate,
	trainingTag = 'astral',
}) => {
	const [activeTab, setActiveTab] = useState('automatic')
	const [isLoading, setIsLoading] = useState(false)
	const [isCreatingInstance, setIsCreatingInstance] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)
	const [formData, setFormData] = useState({
		service: SERVICES[0].name,
		gpuNumber: GPU_LEVELS[0].gpuNumber,
		gpuName: GPU_LEVELS[0].name,
		disk: GPU_LEVELS[0].disk,
		trainingTime: 2,
		budget: (GPU_LEVELS[0].cost * 2).toFixed(2),
		cost: GPU_LEVELS[0].cost,
		instanceSize: 'Weak',
	})
	const [instanceInfo, setInstanceInfo] = useState(null)
	const [sshKey, setSshKey] = useState('')
	const [infrastructureData, setInfrastructureData] = useState({
		id: '',
		sshPort: '',
		publicIP: '',
		presets: 'medium_quality',
		deployPort: '',
		username: '',
		datasetPath: './datasets/tabular',
	})

	// Generate SSH key when switching to userInfras tab
	useEffect(() => {
		if (activeTab === 'userInfras' && !sshKey) {
			const generatedKey = generateRandomKey()
			setSshKey(generatedKey)
		}
	}, [activeTab, sshKey])

	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(sshKey)
		message.success('SSH Key copied to clipboard')
	}

	const handleInfrastructureChange =
		(field) =>
		(value) => {
			setInfrastructureData((prev) => ({
				...prev,
				[field]: value,
			}))
		}

	const handleTrainingTimeChange = (value) => {
		if (value >= 0 && value <= 24) {
			setFormData((prev) => ({
				...prev,
				trainingTime: value,
			}))
		}
	}

	const handleGpuNumberChange = (value) => {
		if (value >= 1 && value <= 8) {
			setFormData((prev) => ({
				...prev,
				gpuNumber: value,
			}))
		}
	}

	const handleDiskChange = (value) => {
		if (value >= 10 && value <= 1000) {
			setFormData((prev) => ({
				...prev,
				disk: value,
			}))
		}
	}

	const handleManualConfigChange =
		(field) =>
		(value) => {
			setFormData((prev) => {
				const next = {
					...prev,
					[field]: value,
				}

				if (field === 'gpuName' || field === 'trainingTime') {
					const gpuName =
						field === 'gpuName' ? value : prev.gpuName
					const trainingTime =
						field === 'trainingTime' ? value : prev.trainingTime
					const selectedGPU = GPU_LEVELS.find(
						(gpu) => gpu.name === gpuName
					)

					if (selectedGPU && trainingTime) {
						next.budget = (
							selectedGPU.cost * trainingTime
						).toFixed(2)
					}
				}

				return next
			})
		}

	// Train model
	const trainModel = async () => {
		// For instance
		let instanceSize = formData.instanceSize
		let selectedGPU
		switch (instanceSize) {
			case 'Weak':
				selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 1)
				break
			case 'Medium':
				selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 2)
				break
			case 'Strong':
				selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 4)
				break
			case 'Super Strong':
				selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 6)
				break
			case 'Rocket':
				selectedGPU = GPU_LEVELS.find((gpu) => gpu.gpuNumber === 8)
				break
			default:
				selectedGPU = GPU_LEVELS[0]
				break
		}
		await new Promise((resolve) => setTimeout(resolve, 1500))
		setFormData((prev) => ({
			...prev,
			service: SERVICES[0].name,
			gpuNumber: selectedGPU.gpuNumber,
			gpuName: selectedGPU.name,
			disk: selectedGPU.disk,
			budget: (selectedGPU.cost * formData.trainingTime).toFixed(2),
			cost: selectedGPU.cost,
		}))
		const time = formData.trainingTime
		const cost = formData.cost * formData.trainingTime
		console.log('Cost: ', cost)

		const presignUrl = await createDownZipPU(selectedProject.dataset_id)
		const payload = {
			cost: cost,
			trainingTime: time * 3600,
			presets: 'medium_quality',
			trainDataId: selectedProject.dataset_id,
			datasetUrl: presignUrl.data,
			datasetLabelUrl: 'hello',
			problemType: selectedProject.meta_data?.is_binary_class
				? 'BINARY'
				: 'MULTICLASS',
			framework: 'autogluon',
			datasetMetadata: selectedProject.meta_data,
			tag: trainingTag || 'astral',
		}
		console.log('Train payload: ', payload)
		const res1 = await trainCloudModel(projectInfo.id, payload)
		return res1.data
	}

	// Find instance and train model sequentially
	const handleStartTraining = async () => {
		if (!formData.trainingTime) {
			message.error('Please input training time')
			return
		}

		if (!selectedProject || !selectedProject.dataset_id) {
			message.error(
				'Dataset is missing for this project. Please go back and select a label project again.'
			)
			return
		}
		setIsProcessing(true)

		navigate(
			`/app/project/${projectInfo.id}/build/training?experimentName=loading&experimentId=loading`,
			{ replace: true }
		)

		try {
			const trainResult = await trainModel()

			if (
				trainResult &&
				trainResult.experimentName &&
				trainResult.experimentId
			) {
				const pid = projectInfo.id ?? projectInfo._id
				if (pid) {
					try {
						sessionStorage.removeItem(`astral:build:draft:${pid}`)
					} catch (_) {
						/* ignore */
					}
				}
				navigate(
					`/app/project/${projectInfo.id}/build/training?experimentName=${trainResult.experimentName}&experimentId=${trainResult.experimentId}`,
					{ replace: true }
				)
			} else {
				message.error('Training result is invalid!')
				navigate(
					`/app/project/${projectInfo.id}/build/selectInstance`,
					{ replace: true }
				)
			}
		} catch (error) {
			console.error('Error', error)
			message.error('Failed to find instance or train model.')
			navigate(`/app/project/${projectInfo.id}/build/selectInstance`, {
				replace: true,
			})
		} finally {
			setIsProcessing(false)
		}
	}

	return {
		// state
		activeTab,
		setActiveTab,
		isLoading,
		setIsLoading,
		isCreatingInstance,
		setIsCreatingInstance,
		isProcessing,
		formData,
		setFormData,
		instanceInfo,
		setInstanceInfo,
		sshKey,
		setSshKey,
		infrastructureData,
		setInfrastructureData,
		// handlers
		handleCopyToClipboard,
		handleInfrastructureChange,
		handleTrainingTimeChange,
		handleGpuNumberChange,
		handleDiskChange,
		handleManualConfigChange,
		handleStartTraining,
	}
}

