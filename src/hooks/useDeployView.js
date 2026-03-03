import * as React from 'react'
import { message } from 'antd'
import { getDeployData } from 'src/api/deploy'
import { getProjectById } from 'src/api/project'
import { getLatestModelVersionByModelId } from 'src/api/model_version'
import * as modelAPI from 'src/api/model'
import * as dataServiceAPI from 'src/api/dataset'
import * as visualizeAPI from 'src/api/visualize'
import config from 'src/pages/project/build/config'
import { validateFilesForPrediction } from 'src/utils/file'
import { PATHS } from 'src/constants/paths'
import axios from 'axios'
import Papa from 'papaparse'

const { useState, useEffect, useRef, useMemo } = React

export const useDeployView = ({ deployId, projectId, theme }) => {
	// Core state
	const [recentPredictions, setRecentPredictions] = useState([])
	const [projectInfo, setProjectInfo] = useState({})
	const [deployData, setDeployData] = useState()
	const [model, setModel] = useState(null)
	const [predictResult, setPredictResult] = useState(null)
	const [uploadedFiles, setUploadedFiles] = useState(null)

	// UI state
	const [uploading, setUploading] = useState(false)
	const [isShowUpload, setIsShowUpload] = useState(false)
	const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isJsonLoading, setIsJsonLoading] = useState(false)
	const [selectedPredictionContent, setSelectedPredictionContent] =
		useState(null)
	const simpleDataModalRef = useRef(null)
	const multilabelModalRef = useRef(null)
	const [isGeneratingUI, setIsGeneratingUI] = useState(false)
	const [isCheckingUIStatus, setIsCheckingUIStatus] = useState(true)
	const [isUIGenerated, setIsUIGenerated] = useState(false)
	const [s3Url, setS3Url] = useState(null)

	// Derived
	const livePredictGradient = useMemo(
		() =>
			theme === 'dark'
				? 'linear-gradient(135deg, rgba(51, 65, 85, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)'
				: 'rgb(249 250 251 / var(--tw-bg-opacity, 1)',
		[theme]
	)

	const taskConfig = useMemo(
		() => config[projectInfo.task_type],
		[projectInfo.task_type]
	)

	// Helpers
	const handleCloseModal = () => {
		setIsModalVisible(false)
		setSelectedPredictionContent(null)
	}

	const handleDownloadHistory = () => {
		if (projectInfo.task_type?.includes('MULTILABEL')) {
			multilabelModalRef.current?.downloadCsv()
		} else {
			simpleDataModalRef.current?.downloadCsv()
		}
	}

	const handleViewPrediction = async (prediction) => {
		setIsModalVisible(true)
		setIsJsonLoading(true)
		setSelectedPredictionContent(null)

		try {
			const s3_key = prediction.predict_data_url
			const downloadJsonContentPresignedUrl =
				await dataServiceAPI.createDownPresignedUrls(s3_key)
			const predictUrl = downloadJsonContentPresignedUrl.data.url
			if (!downloadJsonContentPresignedUrl) {
				throw new Error('Không nhận được Presigned URL.')
			}
			const jsonResponse = await axios.get(predictUrl)
			const predictContent = jsonResponse.data

			if (projectInfo.task_type?.includes('IMAGE')) {
				const imageUrlResponse =
					await dataServiceAPI.getPresignedUrlsForImages(
						prediction.data_url
					)
				const imageUrl = imageUrlResponse.data.data
				const combinedImageData = predictContent.map((item, index) => ({
					...item,
					imageUrl: imageUrl[index],
				}))
				setSelectedPredictionContent(combinedImageData)
			} else {
				const dataUrl = prediction.data_url + prediction.file_name
				const fileUrl =
					await dataServiceAPI.createDownPresignedUrls(dataUrl)
				const fileDownloadUrl = fileUrl.data.url
				const fileContentResponse = await axios.get(fileDownloadUrl)
				const fileContent = fileContentResponse.data
				const parsedCsv = Papa.parse(fileContent, { header: true })

				const inputData = parsedCsv.data.filter((row) =>
					Object.values(row).some(
						(value) => value !== '' && value !== null
					)
				)
				const combinedData = inputData.map((row, index) => ({
					...row,
					...(predictContent[index] || {}),
				}))
				setSelectedPredictionContent(combinedData)
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Error fetching prediction content:', error)
			message.error('Failed to load prediction content. Please try again.')
			setSelectedPredictionContent({
				error: 'Download failed.',
				details: error.message,
			})
		} finally {
			setIsJsonLoading(false)
		}
	}

	const fetchDeployData = async () => {
		if (!deployId) return
		const { data } = await getDeployData(deployId)
		setDeployData(data)
		const res = await getLatestModelVersionByModelId(data.model_id)
		setModel(res.data)
	}

	const fetchProjectData = async () => {
		if (!projectId) return
		const { data } = await getProjectById(projectId)
		setProjectInfo(data.project)
	}

	// Fetch deploy & project on mount/ids change
	useEffect(() => {
		fetchDeployData()
		fetchProjectData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deployId, projectId])

	// Fetch recent predictions
	useEffect(() => {
		if (!projectInfo?.id || !model?.id) return

		const fetchRecentPredictions = async () => {
			setIsLoadingPredictions(true)
			try {
				const response = await dataServiceAPI.getAllDeployData(model.id)
				if (response.status === 200) {
					setRecentPredictions(response.data.deploy_data)
				}
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error("Can't fetch recent predictions:", error)
			} finally {
				setIsLoadingPredictions(false)
			}
		}

		fetchRecentPredictions()
	}, [model, predictResult, projectInfo?.id])

	// Live predict file upload handler
	const handleUploadFiles = async (files, s3_url) => {
		setS3Url(s3_url)
		const fileName = files[0]?.name || 'unknown'
		const validFiles = validateFilesForPrediction(
			files,
			projectInfo?.task_type
		)

		setUploadedFiles((prevFiles) =>
			prevFiles ? [...prevFiles, ...validFiles] : validFiles
		)
		setUploading(true)

		const formData = new FormData()

		Array.from(validFiles).forEach((file) => {
			if (projectInfo?.task_type === 'IMAGE_CLASSIFICATION') {
				formData.append('images', file)
			} else if (projectInfo?.task_type === 'AUDIO_CLASSIFICATION') {
				formData.append('audios', file)
			} else {
				formData.append('file', file)
			}
		})

		formData.append('s3_url', s3_url)
		formData.append('api_base_url', deployData?.api_base_url)
		formData.append('file_name', fileName)

		try {
			const predictRequest = await modelAPI.modelPredict(
				formData,
				model.id
			)
			const data = predictRequest.data
			if (data.status === 'failed') {
				message.error(
					'Your Files are not valid. Please select files has the same structure with your training data',
					5
				)
				setUploading(false)
				return
			}
			const { predictions } = data

			setPredictResult((prevPredictions) =>
				prevPredictions
					? [...prevPredictions, ...predictions]
					: predictions
			)
			setUploading(false)
			message.success('Success Predict', 3)
		} catch (error) {
			message.error('Predict Fail', 3)
			setUploading(false)
		}
	}

	const handleOpenUpload = () => {
		setIsShowUpload(true)
	}

	const handleCloseUpload = () => {
		setIsShowUpload(false)
	}

	const handleGenerateUI = async () => {
		if (!projectInfo?.id || !model || !deployData) return

		if (isUIGenerated) {
			const url = PATHS.PROJECT_DEMO(projectInfo.id)
			window.open(url, '_blank', 'noopener,noreferrer')
			return
		}

		setIsGeneratingUI(true)

		const generatingData = {
			isGenerating: true,
			startedAt: Date.now(),
		}
		localStorage.setItem(
			`ui_generating_${projectInfo.id}`,
			JSON.stringify(generatingData)
		)

		try {
			const projectName = projectInfo.name
			const projectDescription = projectInfo.description
			const taskType = projectInfo.task_type
			const taskDescription =
				projectInfo.description || `A model for ${taskType}`
			const labelsName = model.metadata.label_column
			const labelValues = model.metadata.labels
			const apiEndpoint = deployData?.api_base_url
			let sampleData = model.metadata.sample_data

			if (taskType === 'Image Classification') {
				sampleData = []
			}

			// eslint-disable-next-line no-console
			console.log('Calling genUI API with:', {
				taskType,
				taskDescription,
				labelsName,
				labelValues,
				apiEndpoint,
				sampleData,
			})

			const metadata = {
				projectName: projectName,
				projectDescription: projectDescription,
				taskType: taskType,
				description: '',
				apiUrl: deployData?.api_base_url,
				samples: [],
				modelInfo: model,
			}

			await visualizeAPI.saveMetadata(projectInfo.id, metadata)

			const uiGeneratedData = {
				isGenerated: true,
				timestamp: Date.now(),
				expiresAt: Date.now() + 60 * 60 * 1000,
			}
			localStorage.setItem(
				`ui_generated_${projectInfo.id}`,
				JSON.stringify(uiGeneratedData)
			)
			localStorage.removeItem(`ui_generating_${projectInfo.id}`)

			setIsUIGenerated(true)

			const url = PATHS.PROJECT_DEMO(projectInfo.id)
			// eslint-disable-next-line no-console
			console.log('Opening generated UI at:', url)
			window.open(url, '_blank', 'noopener,noreferrer')
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Error generating UI:', error)
			message.error({
				content:
					error.response?.data?.detail ||
					'Failed to generate UI. Please try again.',
				key: 'genui',
				duration: 3,
			})
			localStorage.removeItem(`ui_generating_${projectInfo.id}`)
		} finally {
			setIsGeneratingUI(false)
		}
	}

	// Check UI generation status on mount / project change
	useEffect(() => {
		if (!projectInfo?.id) return

		const checkUIGenerationStatus = () => {
			setIsCheckingUIStatus(true)

			try {
				const generatingKey = `ui_generating_${projectInfo.id}`
				const generatingData = localStorage.getItem(generatingKey)

				if (generatingData) {
					try {
						const genData = JSON.parse(generatingData)
						Math.floor(
							(Date.now() - genData.startedAt) / (60 * 1000)
						)

						setIsGeneratingUI(true)
						setIsUIGenerated(false)
						setIsCheckingUIStatus(false)
						return
					} catch (e) {
						localStorage.removeItem(generatingKey)
					}
				}

				const generatedKey = `ui_generated_${projectInfo.id}`
				const generatedData = localStorage.getItem(generatedKey)

				if (!generatedData) {
					setIsUIGenerated(false)
					setIsGeneratingUI(false)
					setIsCheckingUIStatus(false)
					return
				}

				const uiData = JSON.parse(generatedData)
				const currentTime = Date.now()

				if (currentTime > uiData.expiresAt) {
					localStorage.removeItem(generatedKey)
					setIsUIGenerated(false)
					setIsGeneratingUI(false)
				} else {
					Math.floor(
						(uiData.expiresAt - currentTime) / (60 * 1000)
					)
					setIsUIGenerated(true)
					setIsGeneratingUI(false)
				}
			} catch (error) {
				localStorage.removeItem(`ui_generated_${projectInfo.id}`)
				localStorage.removeItem(`ui_generating_${projectInfo.id}`)
				setIsUIGenerated(false)
				setIsGeneratingUI(false)
			} finally {
				setIsCheckingUIStatus(false)
			}
		}

		checkUIGenerationStatus()
	}, [projectInfo?.id])

	return {
		// data
		recentPredictions,
		projectInfo,
		deployData,
		model,
		predictResult,
		uploadedFiles,

		// ui state
		uploading,
		isShowUpload,
		isLoadingPredictions,
		isModalVisible,
		isJsonLoading,
		selectedPredictionContent,
		simpleDataModalRef,
		multilabelModalRef,
		isGeneratingUI,
		isCheckingUIStatus,
		isUIGenerated,
		s3Url,

		// derived
		livePredictGradient,
		taskConfig,

		// handlers
		handleOpenUpload,
		handleCloseUpload,
		handleUploadFiles,
		handleCloseModal,
		handleDownloadHistory,
		handleViewPrediction,
		handleGenerateUI,
	}
}

export default useDeployView

